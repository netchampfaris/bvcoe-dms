'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:DataentryCtrl
 * @description
 * # DataentryCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('DataentryCtrl', function ($scope, XLSXReaderService, FirebaseRef, $q) {

    $scope.subjectColumns = [
      {
        data: 'subjectCode',
        title: 'Subject Code'
      },
      {
        data: 'subjectName',
        title: 'Subject FullName'
      },
      {
        data: 'subjectShortName',
        title: 'Subject ShortName'
      },
      {
        data: 'isTheory',
        title: 'Theory ?'
      },
      {
        data: 'isPractical',
        title: 'Practical ?'
      },
      {
        data: 'theoryTeacher',
        title: 'Theory Teacher'
      }
    ];

    $scope.createBatches = function (n) {
      //console.log($scope.subjectColumns);
      $scope.batchInfo = [];
      $scope.subjectColumns = [
        {
          data: 'subjectCode',
          title: 'Subject Code',
          validator: $scope.uidValidator
        },
        {
          data: 'subjectName',
          title: 'Subject FullName'
        },
        {
          data: 'subjectShortName',
          title: 'Subject ShortName'
        },
        {
          data: 'isTheory',
          title: 'Theory ?',
          type: 'checkbox'
        },
        {
          data: 'isPractical',
          title: 'Practical ?',
          type: 'checkbox'
        },
        {
          data: 'theoryTeacher',
          title: 'Theory Teacher'
        }
      ];

      $scope.subjects = [];
      $scope.subjects.push({
        subjectCode: null,
        subjectName: null,
        subjectShortName: null,
        isTheory: false,
        isPractical: false,
        theoryTeacher: null
      });

      for(var i=1; i<=n; i++){
        $scope.batchInfo.push({
          id: i,
          rollno: null
        });
        $scope.subjectColumns.push({
          data: 'batch'+i+'Teacher',
          title: 'Batch '+i+' Teacher'
        });
        $scope.subjects[0]['batch'+i+'Teacher'] = null;
      }

    };

    $scope.createStudents = function (n) {
      $scope.students = [];
      while(n > 0){
        $scope.students[n-1] = {
          uid: null,
          rollno: n,
          name: null,
          phone: null,
          pphone: null,
          gender: null
        };
        n--;
      }
    };

    $scope.genderValidator = function(value, callback) {
      console.log(value);
      callback(value == 'm' || value == 'f');
    };

    $scope.phoneValidator = function(value, callback) {
      console.log(value);
      var isnum = /^\d+$/.test(value);
      callback(value.length == 10 && isnum);
    };

    $scope.uidValidator = function validateId(value, callback) {
      var data = this.instance.getDataAtCol(this.col);
      var index = data.indexOf(value);
      var valid = true;
      console.log(value);
      if (index > -1 && this.row !== index || ~value.indexOf(' ')) {
        valid = false;
      }
      return callback(valid);
    };

    $scope.submit = function (data, batchInfo, students, subjects) {

      _.forEach(subjects, function (value) {
        if(!value.isPractical){
          for(var i = 0; i < batchInfo.length; i++){
            value['batch'+(i+1)+'Teacher'] = null;
          }
        }
        if(!value.isTheory){
          value.theoryTeacher = null;
        }
      });

      console.log(data, batchInfo, students, subjects);

      var defer = $q.defer(),
          dept = data.deptid,
          year = data.yearid,
          sem = data.semid,
          totalStudents = data.totalStudents,
          key = dept + '-' + year,
          batchno = [],
          promises = [];

      _.forEach(batchInfo, function (value) {
        batchno[value.id] = value.rollno;
      });

      //studentCount node
      var promise = FirebaseRef.child('studentCount/'+dept+'/'+key).update({
        batchno: batchno,
        count: totalStudents,
        dept: dept,
        year: year,
        advisor: data.advisor
      });
      promises.push(promise);

      //students node
      _.forEach(students, function (student) {
        promise = FirebaseRef.child('students/'+dept+'/'+student.uid).update({
          name: student.name,
          phone: student.phone,
          parents_phone: student.pphone,
          rollno: student.rollno,
          year: year,
          gender: student.gender,
          uid: student.uid
        });
        promises.push(promise);
      });

      //subjects node
      _.forEach(subjects, function (subject) {
        var pteacher = [];
        for(var i=0; i< batchInfo.length; i++){
          pteacher[i+1] = subject['batch'+(i+1)+'Teacher'];
        }
        promise = FirebaseRef.child('subjects/'+dept+'/'+subject.subjectCode).update({
          fullname: subject.subjectName,
          name: subject.subjectShortName,
          theory: subject.isTheory,
          practical: subject.isPractical,
          teacher: subject.theoryTeacher,
          pteacher: pteacher,
          dept_id: dept,
          year: year,
          sem: sem
        });
        promises.push(promise);
      });

      //departments node
      promise = FirebaseRef.child('departments/'+dept).update({
        name: data.deptname,
        hod: data.hod
      });
      promises.push(promise);

      $q.all(promises).then(function (result) {
        console.log('success', result);
        $scope.form.$setPristine();
        $scope.students = [];
        $scope.subjects = [];
        $scope.data = {};
        defer.resolve();
      }, function (err) {
        defer.reject(err);
      });
      $scope.uploaded = defer.promise;
    };

  });
