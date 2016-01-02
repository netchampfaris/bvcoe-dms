'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('DashboardCtrl', function ($scope, FirebaseAuth, $location, $rootScope, $firebaseObject) {

    $rootScope.authData = FirebaseAuth.$getAuth();

    FirebaseAuth.$onAuth(function(authData) {
      if (authData) {
        console.log("Logged in as:", authData.uid);
      } else {
        console.log("Logged out");
        $location.path('/');
      }
    });

  });
