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
    $scope.batches = [];
    $scope.subs = {};
    var studentCount = 0, batchno = [];

    $scope.getStudents = function () {
      $scope.students = [];

      FirebaseRef.child('students/'+$scope.selected.dept).orderByChild('year').equalTo($scope.selected.year).once('value', function (data) {
        _.forEach(data.val(), function (student, uid) {
          if($scope.selected.type == 'pr'){
            if(+student.rollno >= batchno[$scope.selected.batch].startRoll && +student.rollno <= batchno[$scope.selected.batch].endRoll)
              $scope.students.push({uid: uid, rollno: parseInt(student.rollno), name: student.name});
          }
          else
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
      $scope.selected.batch = null;
      if($scope.selected.type == 'pr')
        getBatches();

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
    var getBatches = function () {
      $scope.batches = [];
      FirebaseRef.child('studentCount/'+$scope.selected.dept+'/'+$scope.selected.dept+'-'+$scope.selected.year).once('value', function (data) {
        console.log(data.val());
        //batchno = data.val().batchno;
        var noofbatches = data.val().batchno.length - 1;

        studentCount = data.val().count;
        batchno = [];
        for(var i=1; i<=noofbatches; i++){
          $scope.batches.push({id:i, name: 'Batch '+i});
          batchno[i] = {};
          batchno[i].startRoll = +data.val().batchno[i];
          batchno[i].endRoll = +data.val().batchno[i+1] - 1 || +studentCount;
        }
        console.log(batchno);
        //$scope.$apply();
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

      $scope.selected.type = null;
      $scope.selected.batch = null;
      $scope.selected.sub = null;
    };

    $scope.submit = function (students) {
      console.log(students);
      var promise, promises = [];
      _.forEach(students, function (student) {
        var temp = {
          att: +student.att,
          totalAtt: +student.totalAtt
        };
        promise =  FirebaseRef.child('lazyAttendances/'+$scope.selected.dept+'/'+student.uid+'/'+$scope.selected.type+'/'+$scope.selected.sub).update(temp);
        promises.push(promise);
      });
      $q.all(promises).then(function (data) {
        console.log(data, 'done');
        $scope.students = [];
      });
      //console.log(lazyAtt);
    };



  });
