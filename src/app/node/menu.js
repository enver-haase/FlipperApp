'use strict';

module.exports = function(ui, solenoid, lamp) {
  return {

    points: 0,

    initialState: 'Menu',

    states: {
      inGame: {
        UpperJetBumperDown: function() {
          solenoid.fire('UpperBumper');
          this.dispatch('BlinkLamp', {id:'UpperJet', duration:20});
          this.dispatch('addPoints', 5000);
        },
        MiddleJetBumperDown: function() {
          solenoid.fire('MiddleBumper');
          this.dispatch('BlinkLamp', {id:'MiddleJets', duration:20});
          this.dispatch('addPoints', 5000);
        },
        LowerJetBumperDown: function() {
          solenoid.fire('LowerBumper');
          this.dispatch('BlinkLamp', {id:'LowerJet', duration:20});
          this.dispatch('addPoints', 5000);
        },
        LeftSlingshotDown: function() {
          this.dispatch('Slingshot', 'Left');
        },
        RightSlingshotDown: function() {
          this.dispatch('Slingshot', 'Right');
        },
        Slingshot: function(side) {
          this.dispatch('BlinkLamp', {id: side + 'SlingGIUpper', duration:20});
          this.dispatch('BlinkLamp', {id: side + 'SlingGILower', duration:20});
          solenoid.fire(side + 'Slingshot');
          this.dispatch('addPoints', 10000);
        },
        addPoints: function(points) {
          this.points += points;
          ui.setPoints(this.points);
        },
        LeftFlipperButtonDown: function () {
          this.dispatch('FlipperButtonDown', 'Left');
        },
        LeftFlipperButtonUp: function () {
          this.dispatch('FlipperButtonUp', 'Left');
        },
        RightFlipperButtonDown: function () {
          this.dispatch('FlipperButtonDown', 'Right');
        },
        RightFlipperButtonUp: function () {
          this.dispatch('FlipperButtonUp', 'Right');
        },
        FlipperButtonDown: function (side) {
          solenoid.fire(side + 'FlipperPower');
          this[side + 'FlipperHoldTimer'] = setTimeout(function() {
            solenoid.fire(side + 'FlipperHold');
          }, 20);
        },
        FlipperButtonUp: function (side) {
          if (this[side + 'FlipperHoldTimer']) {
            clearTimeout(this[side + 'FlipperHoldTimer']);
            this[side + 'FlipperHoldTimer'] = null;
          }
          solenoid.release(side + 'FlipperHold');
        },
        //start button too sensitive
        // TODO: implement other option to end game
        //StartDown: {target: 'Menu'},
        BlinkLamp: function(opts) {
          lamp.on(opts.id);
          setTimeout(function() {
            lamp.off(opts.id);
          }, opts.duration);
        },
        BaseLights: function(mode) {
          lamp[mode]('BottomArchLeftLeft');
          lamp[mode]('BottomArchRightRight');
          lamp[mode]('BottomArchRightLeft');
          lamp[mode]('BottomArchLeftRight');
          lamp[mode]('StartButton');
        },
        TroughBall4Down: function() {
          solenoid.fire('TroughEject');
        },
        states: {
        },
        entry: function () {
          var that = this;
          solenoid.fire('TroughEject');
          // wait for transition to inGame to finish
          // otherwise BaseLights is not defined
          setTimeout(function() {
            that.dispatch('BaseLights', 'on');
          }, 0);
        },
        exit: function() {
          this.dispatch('BaseLights', 'off');
        }
      },
      Menu: {
        // Menu events
        StartDown: function () {
          ui.startSelectedGame();
        },
        RightActionButtonDown: function() {
          ui.nextGame();
        },
        LeftActionButtonDown: function() {
          ui.prevGame();
        },
        states: {},
        entry: function () {
          ui.openMenu();
          this.lampInterval = setInterval(function() {
            lamp.toggle('StartButton');
          }, 1000);
        },
        exit: function() {
          clearInterval(this.lampInterval);
        }
      }
    }
  };
};
