'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:GendefaulterCtrl
 * @description
 * # GendefaulterCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('GendefaulterCtrl', function ($scope,$http, $q) {

    $scope.generate = function (dept, year, sem) {
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: 'http://bvcoeportal.orgfree.com/defaulters/generate_defaulter_api.php/'+dept+'/'+year+'/'+sem
      }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        defer.resolve();
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        defer.reject();
      });
      $scope.promise = defer.promise;

    }

  });
