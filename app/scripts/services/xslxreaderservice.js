'use strict';

/**
 * @ngdoc service
 * @name bvcoeDmsApp.XSLXReaderService
 * @description
 * # XSLXReaderService
 * Factory in the bvcoeDmsApp.
 */
angular.module('bvcoeDmsApp')
  .factory('XLSXReaderService', function ($q, $rootScope) {

    var service = function (data) {
      angular.extec(this,data);
    }

    service.readFile = function (file, readCells, toJson) {
      var deferred = $q.defer();

      XLSXReader(file, readCells, toJson, function (data) {
        $rootScope.$apply(function () {
          deferred.resolve(data);
        });
      });
      return deferred.promise;
    }

    return service;
  });
