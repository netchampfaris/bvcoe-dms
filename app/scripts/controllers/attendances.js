'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:AttendancesCtrl
 * @description
 * # AttendancesCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('AttendancesCtrl', function ($rootScope, $scope, FirebaseRef, $q, $filter) {

    var getAttendances = function () {
      $scope.attendances = [];
      var defer = $q.defer();
      FirebaseRef.child('attendances/'+$rootScope.$storage.userData.dept).orderByChild('teacher').equalTo($rootScope.$storage.authData.uid).once('value', function (snapshot) {
        $scope.attendances = snapshot.val();
        $scope.$apply();
        defer.resolve();
      }, function (err) {
        console.log(err);
        defer.reject();
      });
      return defer.promise;
    }
    var getStudents = function () {
      var defer = $q.defer();
      FirebaseRef.child('students/'+$rootScope.$storage.userData.dept).once('value', function (data) {
        $scope.students = data.val();
        defer.resolve();
      }, function (err) {
        defer.reject();
      });
      return defer.promise;
    }
    var getDepts = function () {
      var defer = $q.defer();
      FirebaseRef.child('departments').once('value', function (data) {
        $scope.depts = data.val();
        defer.resolve();
      }, function (err) {
        defer.reject();
      });
      return defer.promise;
    }
    var getSubjects = function () {
      var defer = $q.defer();
      FirebaseRef.child('subjects/'+$rootScope.$storage.userData.dept).once('value', function (data) {
        $scope.subjects = data.val();
        defer.resolve();
      }, function (err) {
        defer.reject();
      });
      return defer.promise;
    }

    var defer = $q.defer();
    getAttendances().then(function () {
      getStudents().then(function () {
        getDepts().then(function () {
          getSubjects().then(function () {
            defer.resolve();
          })
        })
      })
    })
    $scope.promise = defer.promise;


    $scope.years = [
      {
        id: 'fe', name: 'First Year'
      },
      {
        id: 'se', name: 'Second Year'
      },
      {
        id: 'te', name: 'Third Year'
      },
      {
        id: 'be', name: 'Final Year'
      }
    ]
    $scope.types = {
      th: 'Theory',
      pr: 'Practical'
    };










    $scope.showDept = function(dept) {
      for(var deptid in $scope.depts)
      {
        if(dept == deptid)
          return $scope.depts[deptid]['name'];
      }
    }

    $scope.showYear = function(year) {
      var selected = [];
      if(year) {
        selected = $filter('filter')($scope.years, {id: year});
      }
      return selected.length ? selected[0].name : 'Not set';
    }

    $scope.showSem = function(sem) {
      return 'Semester '+sem;
    }

    $scope.showSub = function(sub) {
      for(var subid in $scope.subjects)
      {
        if(sub == subid)
        {
          return $scope.subjects[subid]['name'];
        }
      }
    }
    $scope.showType = function(item) {
      if(item.type == 'th')
        return 'Theory';
      else(item.type == 'pr')
      {
        return 'Practical:  Batch '+item.batchno;
      }
    }

    function natural(a,b) {
      var x = parseInt(a);
      var y = parseInt(b);
      if (x < y)
        return -1;
      else if (x > y)
        return 1;
      else
        return 0;
    }

    $scope.showAbsent = function(absentno){
      var absent = [];
      if(absentno){
        absent = _.filter($scope.students, function(s) { return _.includes(absentno, s.uid) });
      }
      return _.pluck(absent, 'rollno').sort(natural).join(', ');
    }

    $scope.saveAtt = function (data, key, item) {
      console.log(data);
      console.log(key);
      console.log(item);
    }
    $scope.delAtt = function (data, key, item) {
      console.log(data);
      console.log(key);
      console.log(item);
    }
    $scope.cancel = function(rowform){
      rowform.$cancel();
    }

  });
