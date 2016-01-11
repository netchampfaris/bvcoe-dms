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

    $scope.json_string = "";

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
    }


    $scope.upload = function () {
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
      };
      FirebaseRef.child('studentCount/'+dept+'/'+key).set({
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
           /* var pad = "000";
            var rollpad = pad.substring(0, pad.length - str.length) + str;
            var key = dept + year + rollpad;*/

            FirebaseRef.child('students/'+dept+'/'+key).set({

              name: name,
              phone: phone,
              parents_phone: pphone,
              rollno: roll,
              year: year,
              gender: gender

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
                  var teacher = sheets.subjects[i]['theory teacher'];
                  var key = sheets.subjects[i]['subject code'];
                  var pteacher = {};

                  var j = 1;
                  while(j<5)
                  {
                    if(sheets.subjects[j]['batch '+j+' teacher'] !== undefined)
                    {
                      pteacher[j] = sheets.subjects[j]['batch '+j+' teacher'];
                    }
                    else
                      break;
                    j++;
                  }

                  FirebaseRef.child('subjects/'+dept+'/'+key).set({

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

                      FirebaseRef.child('departments/'+dept).set({
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
    }


  });
