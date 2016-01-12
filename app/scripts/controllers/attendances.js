'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:AttendancesCtrl
 * @description
 * # AttendancesCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('AttendancesCtrl', function ($rootScope, $scope, FirebaseRef, $q) {

    $scope.attendances = [];
    console.log('test');

    var defer = $q.defer();
    FirebaseRef.child('attendances').once('value', function (snapshot) {
      var attendances = snapshot.val();
      console.log(attendances);

      for(var dept in attendances)
      {
        for(var att in attendances[dept])
        {
          if(attendances[dept][att]['teacher'] == $rootScope.authData.uid)
            $scope.attendances[att] = attendances[dept][att];
        }
      }
      defer.resolve();
      $scope.$apply();
    }, function (err) {
      console.log(err);
      defer.reject();
    });

    $scope.promise = defer.promise;
  });
