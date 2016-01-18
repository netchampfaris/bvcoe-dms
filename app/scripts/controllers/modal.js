'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:ModalctrlCtrl
 * @description
 * # ModalctrlCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('ModalCtrl', function (defaulters, $scope) {
    console.log(defaulters);

    $scope.students = defaulters;


    $scope.checkDefaulter = function (percent) {
      console.log(percent);
      if(percent < '75'){
        return true;
      }
      else return false;

    }
  });
