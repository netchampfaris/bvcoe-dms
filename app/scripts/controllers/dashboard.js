'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('DashboardCtrl', function ($scope, FirebaseAuth, $location, $rootScope, firebaseurl) {

    $rootScope.authData = FirebaseAuth.$getAuth();

    FirebaseAuth.$onAuth(function(authData) {
      if (authData) {
        console.log("Logged in as:", authData.uid);
        $rootScope.access = true;
      } else {
        console.log("Logged out");
        $location.path('/');
      }
    });

    var destroyToken = function (tokenid) {
      var tokenref = new Firebase(firebaseurl+'/token/'+tokenid);
      tokenref.set(null, function(error){
        if(error)
          console.log(error);
        else
          console.log('token destroyed:'+error);
      });
    }

  });
