/**
 * Created by acomitevski on 04/05/14.
 */

'use strict';

angular.module('fuNodeInterface')
  .factory('uiInterface', function() {
    var ui = require('./node/helpers/ui');
    return ui;
  });