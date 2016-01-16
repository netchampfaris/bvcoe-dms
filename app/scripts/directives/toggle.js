'use strict';

/**
 * @ngdoc directive
 * @name bvcoeDmsApp.directive:toggle
 * @description
 * # toggle
 */
angular.module('bvcoeDmsApp')
  .directive('toggle', function(){
    return {
      restrict: 'A',
      link: function(scope, element, attrs){
        if (attrs.toggle=="tooltip"){
          $(element).tooltip();
        }
        if (attrs.toggle=="popover"){
          $(element).popover();
        }
      }
    };
  })
