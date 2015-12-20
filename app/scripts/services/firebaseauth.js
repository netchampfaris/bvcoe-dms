'use strict';

/**
 * @ngdoc service
 * @name bvcoeDmsApp.FirebaseAuth
 * @description
 * # FirebaseAuth
 * Service in the bvcoeDmsApp.
 */
angular.module('bvcoeDmsApp')
  .factory('FirebaseAuth', function ($firebaseAuth) {
      var ref = new Firebase("https://hazri.firebaseio.com/");
      return $firebaseAuth(ref);
    });
