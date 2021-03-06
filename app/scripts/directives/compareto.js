'use strict';

/**
 * @ngdoc directive
 * @name bvcoeDmsApp.directive:compareTo
 * @description
 * # compareTo
 */
angular.module('bvcoeDmsApp')
  .directive('compareTo', function() {
    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
          ngModel.$validate();
        });
      }
    };
  });
