'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:ExtrasCtrl
 * @description
 * # ExtrasCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('ExtrasCtrl', function ($scope, FirebaseRef, $q, $rootScope) {

    var dept = $rootScope.$storage.userData.dept;
    var dfd = $q.defer();
    FirebaseRef.child('students/'+dept).orderByChild('year').equalTo($rootScope.$storage.userData.year).once('value', function (data) {
      $scope.students = data.val();

      FirebaseRef.child('extras/'+dept).orderByChild('year').equalTo($rootScope.$storage.userData.year).once('value', function (snap) {

        var extras = snap.val();
        //console.log(extras);
        for(var extra in extras)
        {
          $scope.students[extra]['extra'] = extras[extra]['extra'];
        }
        $scope.$apply();
        dfd.resolve();
      });
      //console.log($scope.students);
    });
    $scope.stuPromise = dfd.promise;

    $scope.updateExtra = function(student, data) {
      var defer = $q.defer();
      FirebaseRef.child('extras/'+dept+'/'+student.uid).update({
        extra: data,
        year: student.year
      }, function(error){
        if(error)
        {
          defer.reject();
        }
        else defer.resolve();
      });
      return defer.promise;
    };
  });
