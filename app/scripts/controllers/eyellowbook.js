'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:EyellowbookCtrl
 * @description
 * # EyellowbookCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
    .controller('EyellowbookCtrl', function ($scope, $http, $localStorage, FirebaseRef, $q, ngToast, $timeout) {
        var allData;
        $scope.sublists = [];
        $scope.data = {};
        $scope.students;
        $scope.LA = {};
        $scope.edited = {};
        $scope.edit = {};
        $scope.cumAtt={};
        $scope.calculateCumAtt = function(rollno, att, totalAtt){
            //console.log(rollno);
            if(!$scope.cumAtt[rollno])
            $scope.cumAtt[rollno] = {'att':0,'totalAtt':0};
            $scope.cumAtt[rollno].att += +att;
            $scope.cumAtt[rollno].totalAtt += +totalAtt;
        };
        $scope.enableEditing = function (key) {
            $scope.edit[key] = true;
        };
        $scope.doneEditing = function (key) {
            $scope.edit[key] = false;
        };
        $scope.clearEdit = function () {
            $scope.edited = {};
            $scope.edit = {};
        };
        $scope.checkEmptyObject = function (item) {
            return angular.equals({}, item);
        };

        var defer = $q.defer();
        $http({ method: 'GET', url: "http://hazri.herokuapp.com/getEyellowBookData/" + $localStorage.authData.uid })
            .then(function successCallback(response) {
                allData = response.data;
                Object.keys(allData).forEach(function (subuid) {
                  var subName;
                  Object.keys(allData[subuid]).forEach(function (dept) {
                    FirebaseRef.child('subjects/' + dept + "/" + subuid).once("value", function (snapshot) {
                      if (snapshot.exists()) {
                        subName = snapshot.val().name;
                      }
                      else {
                        subName = subuid;
                      }
                    }).then(function () {
                      Object.keys(allData[subuid][dept]).forEach(function (type) {
                        if (type === "pr") {
                          Object.keys(allData[subuid][dept][type]).forEach(function (batch) {
                            $scope.sublists.push(subName + " > " + dept + " > " + type + " > B" + batch);
                            $scope.data[subName + " > " + dept + " > " + type + " > B" + batch] = allData[subuid][dept][type][batch];
                          });
                        }
                        else {
                          $scope.sublists.push(subName + " > " + dept + " > " + type);
                          $scope.data[subName + " > " + dept + " > " + type] = allData[subuid][dept][type];
                        }
                      });
                    });
                  });
                });
                defer.resolve();
            }, function errorCallback() {
                defer.reject();
            });

        $timeout(function () {
          $scope.$apply('data');
        }, 3000);
        
        $scope.promise = defer.promise;
        $scope.reCalculateCumAtt =function(rollno,noofhours,status){
            console.log(status,rollno,noofhours);
            if(status=='pr')
            {
                $scope.cumAtt[rollno].att+=+noofhours;
            }
            if(status=='ab')
            {
                $scope.cumAtt[rollno].att-=+noofhours;
            }
        }
        $scope.showEyellowBook = function (selection) {
            $scope.cumAtt = {};
            var defer = $q.defer();
            var year = $scope.data[selection].year;
            var dept = $scope.data[selection].dept;
            var type = $scope.data[selection].type;
            var subId = $scope.data[selection].subid;
            var batchno = +$scope.data[selection].batchno || 0;
            FirebaseRef.child("students/" + dept).orderByChild("year").equalTo(year).once("value", function (students) {
                if (type === "pr") {
                    $scope.students = {};
                    FirebaseRef.child("studentCount/" + dept + "/" + dept + "-" + year + "/batchno").once("value", function (snapshot) {
                        var start = +snapshot.val()[batchno];

                        var counter = 0;
                        students.forEach(function (student) {
                            if (snapshot.val()[batchno + 1]) {
                                var end = +snapshot.val()[batchno + 1];
                                if (+student.val().rollno < end && +student.val().rollno >= start) {
                                    $scope.students[student.key()] = student.val();
                                }
                            }

                            else {
                                if (+student.val().rollno >= start) {
                                    $scope.students[student.key()] = student.val();
                                }
                            }

                            FirebaseRef.child("lazyAttendances/" + dept + "/" + student.key() + "/" + type + "/" + subId).once("value", function (att) {
                                if (att.exists())
                                    $scope.LA[student.key()] = att.val();
                                else
                                    $scope.LA[student.key()] = {
                                        att: 0,
                                        totalAtt: 0
                                    }
                            }).then(function () {
                                //console.log(counter, Object.keys(students.val()).length);
                                if (++counter == Object.keys(students.val()).length) {
                                    //$scope.students = students.val();
                                    done();
                                }
                            });

                        })
                    })
                }
                else {
                    var counter = 0;
                    students.forEach(function (student) {
                        FirebaseRef.child("lazyAttendances/" + dept + "/" + student.key() + "/" + type + "/" + subId).once("value", function (att) {
                            if (att.exists())
                                $scope.LA[student.key()] = att.val();
                            else
                                $scope.LA[student.key()] = {
                                    att: 0,
                                    totalAtt: 0
                                }
                        }).then(function () {
                            if (++counter == Object.keys(students.val()).length) {
                                $scope.students = students.val();
                                done();
                            }
                        });
                    });

                }
            });

            var done = function () {
                $scope.selection = $scope.data[selection].att;
                defer.resolve();
            };

            $scope.promise1 = defer.promise;

        };
        $scope.click = function (key, stuid) {
            console.log(key);
            var abIndex = $scope.selection[key].absentno.indexOf(stuid);
            var prIndex = $scope.selection[key].presentno.indexOf(stuid)
            if (abIndex > -1) {
                $scope.selection[key].absentno.splice(abIndex, 1);
                $scope.selection[key].presentno.push(stuid);
            }
            if (prIndex > -1) {
                $scope.selection[key].presentno.splice(prIndex, 1);
                $scope.selection[key].absentno.push(stuid);
            }
            $scope.edited[key] = $scope.selection[key];
        };



        $scope.upload = function () {
            var svRef = new Firebase('https://hazrisv.firebaseio.com');
            $scope.edit = {};
            if ($scope.edited) {
                Object.keys($scope.edited).forEach(function (key) {
                    var dept = $scope.edited[key].dept;
                    delete $scope.edited[key].$$hashKey;
                    $scope.edited[key].timestamp = Firebase.ServerValue.TIMESTAMP;
                    var newAtt = $scope.edited[key];
                    FirebaseRef.child("attendances/" + dept + "/" + key).once("value", function (oldAtt) {
                        console.log(oldAtt.val(), newAtt);
                        svRef.child('serviceQueue/changed/old/' + key).update(oldAtt.val(), function (err) {
                            if (!err)
                                FirebaseRef.child("attendances/" + dept + "/" + key).update(newAtt).then(function () {
                                    svRef.child('serviceQueue/changed/new/' + key).update(newAtt, function (err) {
                                        delete $scope.edited[key];
                                        ngToast.create({
                                            className: 'success',
                                            content: 'Uploaded Successfully',
                                            dismissOnTimeout: true,
                                            timeout: 1000,
                                            animation:'fade',

                                        });
                                        console.log("allDoneSuccessfully");
                                    });
                                });
                        });
                    });
                });
            }
        }
    });
