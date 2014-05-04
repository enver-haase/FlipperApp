/**
 * Created by acomitevski on 04/05/14.
 */
'use strict';

/*jshint expr: true*/

var uiMock,
  menu = require(root + 'menu'),
  _ = require('underscore'),
  Statechart = require('statechart'),
  MenuHsm;


describe('Menu HSM', function() {

  beforeEach(function() {
    uiMock = {
      openMenu: sinon.spy()
      ,startSelectedGame: sinon.spy()
      ,nextGame: sinon.spy()
      ,prevGame: sinon.spy()
    };
    MenuHsm = _.extend(menu(uiMock), Statechart);
  });
  afterEach(function() {
    MenuHsm = null;
    uiMock = null;
  });

  describe('entry', function() {
    beforeEach(function() {
    });
    it('should open menu in ui', function() {
      MenuHsm.run();
      uiMock.openMenu.should.have.been.calledOnce;
    });
  });
  describe('start', function() {
    it('should start selected game in ui', function() {
      MenuHsm.run();
      MenuHsm.dispatch('start');
      uiMock.startSelectedGame.should.have.been.calledOnce;
      uiMock.openMenu.should.have.been.calledOnce;
    });
  });

  describe('RightActionButton', function() {
    it('should select next game', function() {
      MenuHsm.run();
      MenuHsm.dispatch('RightActionButton');
      uiMock.nextGame.should.have.been.calledOnce;
    });
  });

  describe('LeftActionButton', function() {
    it('should select next game', function() {
      MenuHsm.run();
      MenuHsm.dispatch('LeftActionButton');
      uiMock.prevGame.should.have.been.calledOnce;
    });
  });

});