'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:AdminpanelCtrl
 * @description
 * # AdminpanelCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('AdminpanelCtrl', function ($scope, FirebaseRef, $q) {

    $scope.reset = function (dept) {
      var ref = new Firebase('https://hazrisv.firebaseio.com/commands');
      ref.push({
        command: 'reset',
        dept: dept
      });
    };

    $scope.changeUID = function(uid1, uid2, dept){
      var defer = $q.defer();
      uid1 = uid1.toUpperCase();
      uid2 = uid2.toUpperCase();

      console.log(uid1, uid2, dept);

      if(uid1 == uid2)
        throw 'same uid';

      var year;
      FirebaseRef.child('students/'+dept+'/'+uid1).once('value')
        .then(function (snap) {
          var student = snap.val();
          year = student.year;
          if(student != null){
            student.uid = uid2;
            return FirebaseRef.child('students/'+dept+'/'+uid2).update(student);
          }
          else
            throw 'invalid uid';
        })
        .then(function () {
          return FirebaseRef.child('students/'+dept+'/'+uid1).remove();
        })
        .then(function () {
          return FirebaseRef.child('attendances/'+dept).orderByChild('year').equalTo(year).once('value')
        })
        .then(function (snap) {
          var attendances = snap.val();
          //console.log(attendances);
          _.forEach(attendances, function (att, key) {

            att.absentno = _.map(att.absentno,function(el){
              return (el === uid1) ? uid2 : el;
            });
            att.presentno = _.map(att.presentno,function(el){
              return (el === uid1) ? uid2 : el;
            });

          });
          console.log('after', attendances);
          return FirebaseRef.child('attendances/'+dept).update(attendances);
        })
        .then(function (res) {
          console.log('done', res);
          defer.resolve();
        }, function (err) {
          console.log(err);
          defer.reject();
        });

      $scope.finished = defer.promise;
    }
  });
