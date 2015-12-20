'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('MainCtrl', function (FirebaseAuth,$firebaseAuth, $scope, $location, $rootScope) {

      FirebaseAuth.$onAuth(function(authData) {
        if (authData) {
          console.log("Logged in as:", authData.uid);
          $rootScope.access = true;
          $location.path('/dashboard');
        } else {
          console.log("Logged out");
          $rootScope.access = false;
        }
      });

      $scope.login = function (user) {
        console.log(user);
        var ref = new Firebase("https://hazri.firebaseio.com");
        var log = $firebaseAuth(ref);
        ref.authWithPassword({
          "email": user.email,
          "password": user.pass
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            $rootScope.authData = authData;
            $location.path('/dashboard');
          }
        },{
          remember: 'sessionOnly'
        });
      }


  });
