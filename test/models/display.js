'use strict';

var setup = require('../.');

var should = require('should'),
    models = require('../../lib/models');

describe('Display', function() {

  beforeEach(function(done) {
    // Setup the database
    setup.db()
      .then(function() { done(); }, function(err) { done(err); });
  });

  describe('#register()', function() {
    it('should create a new display', function(done) {
      models.Display.register()
        .then(function(display) {
          var name = display.toJSON().name;
          name.should.have.length(6);
          return models.Display.get(name)
            .then(function(display) {
              display.toJSON().name.should.equal(name);
              done();
            });
        })
        .catch(function(err) { done(err); });
    });

    it('should create a new display on unknown name', function(done) {
      models.Display.register('NOTAVALIDNAME')
        .then(function(display) {
          var name = display.toJSON().name;
          name.should.have.length(6);
          name.should.not.be.equal('NOTVALIDNAME');
          done();
        });
    });

    it('should accept a returning display', function(done) {
      models.Display.register()
        .then(function(display) {
          var name = display.toJSON().name;
          return models.Display.register(name)
            .then(function(display) {
              display.toJSON().name.should.equal(name);
              return models.Display.all()
                .then(function(displays) {
                  displays[name].should.not.equal(undefined);
                  done();
                });
            });
        })
        .catch(function(err) { done(err); });
    });

    it('should be associated to the unassigned group', function(done) {
      models.Display.register()
        .then(function(display) {
          return models.Group.get(display.toJSON().group);
        })
        .then(function(group) {
          group.toJSON().name.should.equal('unassigned');
          done();
        })
        .catch(function(err) { done(err); });
    });

  });

  describe('#setGroup()', function() {
    it('should assign a group to a display', function(done) {
      models.Display.register()
        .then(function(display) {
          var name = display.toJSON().name;
          var group = new models.Group('test group');
          return group.create()
            .then(function(group) {
              return display.setGroup(group)
                .then(function() {
                  return models.Display.register(name);
                })
                .then(function(display) {
                  display.toJSON().name.should.equal(name);
                  display.toJSON().group.should.equal(group.toJSON().id);
                  done();
                });
            });
        })
        .catch(function(err) { done(err); });
    });
  });

});
