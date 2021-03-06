'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:GendefaulterCtrl
 * @description
 * # GendefaulterCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('GendefaulterCtrl', function ($scope,$http, $q, restapiurl, $uibModal) {

    $scope.message = {
      success : false
    };

    $scope.generate = function (dept, year, sem) {
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: restapiurl+'/generateDefaulter/'+dept+'/'+year+'/'+sem
      }).then(function successCallback(response) {
        console.log(response);
        //$scope.defaulters = response.data.data;
        defer.resolve();
        $scope.message.success = true;
        //alert('Defaulter generated successfully');
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        defer.reject();
      });
      $scope.promise = defer.promise;
    };
  });
