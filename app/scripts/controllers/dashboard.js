'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('DashboardCtrl', function ($scope, FirebaseAuth, $location, $rootScope, $http) {

    $scope.push = function (notif) {

      // Define relevant info
      var privateKey = '40862591aa0d0abdcaa450c53fd513ab31369a39c56de17d';
      //var tokens = ['f0l_tP0TRi4:APA91bHtR0Nm8SXTo1iF46qhd82_sHZiJgAZ3EPwphldZf7C3SYAItFU25hD5tAVsNmYk6gUWidkTvTDf26HqFa7bDN3Cw4IIaYL3Y4mlpYcvyroKDi2DfBw2mzEgVXyFLQcEkKsAKqo'];
      var appId = '1bb897af';
      var tokens = notif.tokens.split(",");
      console.log(tokens);
// Encode your key
      var auth = btoa(privateKey + ':');

// Build the request object
      var req = {
        method: 'POST',
        url: 'https://push.ionic.io/api/v1/push',
        headers: {
          'Content-Type': 'application/json',
          'X-Ionic-Application-Id': appId,
          'Authorization': 'basic ' + auth
        },
        data: {
          "tokens": tokens,
          "notification": {
            "alert": notif.body,
            "title": notif.title
          }
        }
      };

      $http(req).success(function(resp){
        // Handle success
        console.log("Ionic Push: Push success!");
      }).error(function(error){
        // Handle error
        console.log("Ionic Push: Push error...");
      });

    }

  });
