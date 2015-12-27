'use strict';

/**
 * @ngdoc service
 * @name bvcoeDmsApp.FirebaseAuth
 * @description
 * # FirebaseAuth
 * Service in the bvcoeDmsApp.
 */
angular.module('bvcoeDmsApp')
  .factory('FirebaseAuth', function ($firebaseAuth, firebaseurl) {
      var ref = new Firebase(firebaseurl);
      return $firebaseAuth(ref);
  });
