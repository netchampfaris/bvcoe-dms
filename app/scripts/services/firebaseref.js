'use strict';

/**
 * @ngdoc service
 * @name bvcoeDmsApp.FirebaseRef
 * @description
 * # FirebaseRef
 * Factory in the bvcoeDmsApp.
 */
angular.module('bvcoeDmsApp')
  .factory('FirebaseRef', function (firebaseurl) {

    var ref = new Firebase(firebaseurl);
    return ref;

  });
