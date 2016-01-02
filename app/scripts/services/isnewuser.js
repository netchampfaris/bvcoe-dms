'use strict';

/**
 * @ngdoc service
 * @name bvcoeDmsApp.isNewUser
 * @description
 * # isNewUser
 * Factory in the bvcoeDmsApp.
 */
angular.module('bvcoeDmsApp')
  .factory('isNewUser', function (FirebaseRef, $q) {

    var isNewUser = function(authData) {
      var defer = $q.defer();
      var isNew = true;
      FirebaseRef.child('teachers').once('value', function(snapshot) {
        for(var dept in snapshot.val())
        {
          for(var uid in snapshot.val()[dept]) {
            if(authData.uid == uid){
              isNew = false;
            }
          }
        }
        defer.resolve(isNew);
      }, function(err) {
        console.log(err);
        defer.reject();
      });
      return defer.promise;
    };

    return isNewUser;

  });
