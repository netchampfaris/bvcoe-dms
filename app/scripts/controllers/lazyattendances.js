'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:LazyattendancesCtrl
 * @description
 * # LazyattendancesCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('LazyattendancesCtrl', function ($scope, $q, FirebaseRef) {

    var students, sems = {};
    $scope.years = [];
    $scope.depts = [];
    $scope.students = [];
    $scope.subs = {};

    $scope.getStudents = function () {
      $scope.students = [];

      FirebaseRef.child('students/'+$scope.selected.dept).orderByChild('year').equalTo($scope.selected.year).once('value', function (data) {
        _.forEach(data.val(), function (student, uid) {
          $scope.students.push({uid: uid, rollno: parseInt(student.rollno), name: student.name});
        });
        $scope.students = _.sortBy($scope.students, function (stu) {
          return parseInt(stu.rollno);
        });
        $scope.$apply();
      }, function (err) {
      });
    };
    var getDepts = function () {
      var defer = $q.defer();
      FirebaseRef.child('departments').once('value', function (data) {
        //$scope.depts = data.val();
        _.forEach(data.val(), function (value, id) {
          $scope.depts.push({id:id, name:value.name});
        });
        defer.resolve();
      }, function (err) {
        defer.reject();
      });
      return defer.promise;
    };
    $scope.getSubjects = function () {
      $scope.subs = {};
      FirebaseRef.child('subjects/'+$scope.selected.dept).orderByChild('sem').equalTo($scope.selected.sem).once('value', function (data) {
        _.forEach(data.val(), function (sub, id) {
          if((sub.theory && $scope.selected.type == 'th') || (sub.practical && $scope.selected.type == 'pr')){
            $scope.subs[id] = sub;
          }
        });
        $scope.$apply();
      }, function (err) {

      });
    };

    var getYears = function () {
      var defer = $q.defer();
      FirebaseRef.child('year').once('value', function (data) {
        var year = data.val();
        //console.log(year);
        _.forEach(year, function (value, id) {
          $scope.years[value.level-1] = {id:id, name: value.name};
          sems[id] = value.sems;
        });
        //console.log(sems);
        defer.resolve();
      }, function (err) {
        defer.reject();
      });
      return defer.promise;
    };


    var defer = $q.defer();
    getDepts().then(function () {
      getYears().then(function () {
        defer.resolve();
      });
    });
    $scope.promise = defer.promise;

    $scope.setSem = function () {
      $scope.selected.sem = null;
      $scope.sems = sems[$scope.selected.year];
    }

    $scope.submit = function (students) {
      console.log(students);
      var promise, promises = [];
      _.forEach(students, function (student) {
        var temp = {
          att: student.att,
          totalAtt: student.totalAtt
        };
        promise =  FirebaseRef.child('lazyAttendances/'+$scope.selected.dept+'/'+student.uid+'/'+$scope.selected.type+'/'+$scope.selected.sub).update(temp);
        promises.push(promise);
      });
      $q.all(promises).then(function (data) {
        console.log(data, 'done');
        $scope.students = [];
      });
      //console.log(lazyAtt);
    }

    $scope.reset = function () {
      var ref = new Firebase('https://hazrisv.firebaseio.com/commands');
      ref.push({
        command: 'reset',
        dept: $scope.selected.dept
      });
    }

  });
