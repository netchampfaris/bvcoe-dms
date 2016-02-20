'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:DataentryCtrl
 * @description
 * # DataentryCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('DataentryCtrl', function ($scope, XLSXReaderService, FirebaseRef, $q, $timeout) {

    /*$scope.json_string = "";

    $scope.isProcessing = true;

    var sheets = [];

    $scope.fileChanged = function(files) {
      $scope.excelFile = files[0];
      XLSXReaderService.readFile($scope.excelFile, false, true).then(function(xlsxData) {
        sheets = xlsxData.sheets;
        $scope.isProcessing = false;
        console.log(sheets);
      });
    }


    $scope.download = function(base64) {
      var base64;
      FirebaseRef.child('defaulters/excelformat').once('value', function (snapshot) {
        base64 = snapshot.val();
        console.log(base64);
        window.open (base64, "", "width=600,height=300,resizable=1");
      })
    }*/

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
      if (index > -1 && this.row !== index) {
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
        defer.resolve();
      }, function (err) {
        defer.reject(err);
      });
      $scope.uploaded = defer.promise;
    };

    /*$scope.upload = function () {
      var defer = $q.defer();

      var dept = sheets.info[0]['dept'];
      var year = sheets.info[0]['year'];
      var sem = sheets.info[0]['semester'];
      var totalStudents = sheets.info[0]['total students'];
      var key = dept + '-' + year;
      var batchno = {};
      var i = 1;
      while(i<6)
      {
        if(sheets.info[0]['batch '+i+' starts with roll'] !== undefined)
        {
          batchno[i] = sheets.info[0]['batch '+i+' starts with roll'];
        }
        else
         break;
        i++;
      }
      FirebaseRef.child('studentCount/'+dept+'/'+key).update({
        batchno: batchno,
        count: totalStudents,
        dept: dept,
        year: year
       }, function (error) {
        if(error) console.log(error);
        else{

          for(var i=0; i<totalStudents; i++)
          {
            var name = sheets.students[i]['name'];
            var roll = sheets.students[i]['rollno'];
            var phone = sheets.students[i]['phone'];
            var pphone = sheets.students[i]['parents phone'];
            var gender = sheets.students[i]['gender'];
            var key = sheets.students[i]['unique id'];

            var str = "" + roll;
           /!* var pad = "000";
            var rollpad = pad.substring(0, pad.length - str.length) + str;
            var key = dept + year + rollpad;*!/

            FirebaseRef.child('students/'+dept+'/'+key).update({

              name: name,
              phone: phone,
              parents_phone: pphone,
              rollno: roll,
              year: year,
              gender: gender,
              uid:key

            }, function (error) {
              if(error) console.log(error);
              else
              {

                for(var i=0; i<sheets.subjects.length; i++)
                {
                  var fullname = sheets.subjects[i]['fullname'];
                  var sname = sheets.subjects[i]['short name'];
                  var theory = (sheets.subjects[i].theory == 'yes');
                  var practical = (sheets.subjects[i].practical == 'yes');
                  var teacher = sheets.subjects[i]['theory teacher'] || null;
                  var key = sheets.subjects[i]['subject code'];
                  var pteacher = {};

                  var j = 1;
                  while(j<5)
                  {
                    if(sheets.subjects[i]['batch '+j+' teacher'] !== undefined)
                    {
                      pteacher[j] = sheets.subjects[i]['batch '+j+' teacher'];
                    }
                    else
                      break;
                    j++;
                  }
                  console.log(pteacher);

                  FirebaseRef.child('subjects/'+dept+'/'+key).update({

                    fullname: fullname,
                    name: sname,
                    theory: theory,
                    practical: practical,
                    teacher: teacher,
                    pteacher: pteacher,
                    dept_id: dept,
                    year: year,
                    sem: sem

                  }, function (error) {
                    if(error) console.log(error);
                    else {

                      var deptname = sheets.info[0]['dept name'];
                      var division = null;
                      if(dept.indexOf('-') != -1)
                        division = dept.substr(dept.length-1);

                      FirebaseRef.child('departments/'+dept).update({
                        name: deptname,
                        div: division
                      }, function (error) {
                        if(error) console.log(error);
                        else {
                          console.log('success');
                        }
                      });

                    }
                  });
                }
              }
            });
          }

        }

          $timeout(function () {
            console.log('data upload successfull');
            $scope.success = "Data upload successfull";
            $scope.form.$setPristine();
            defer.resolve();
          }, 5000);
      });


      $scope.loading =  defer.promise;
    }*/


  });
