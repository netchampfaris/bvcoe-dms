'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:AttendancesCtrl
 * @description
 * # AttendancesCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('AttendancesCtrl', function ($rootScope, $scope, FirebaseRef, $q, $filter, $localStorage) {

    $rootScope.$storage = $localStorage;
    FirebaseRef.child('teachers/'+$localStorage.authData.uid).once('value')
      .then(function (snap) {
        $localStorage.userData = snap.val();
        $scope.$apply();
      });

    var students = {};

    var getAttendances = function () {
      $scope.attendances = [];
      var defer = $q.defer();
      var teachersAtt = FirebaseRef.child('attendances/'+$rootScope.$storage.userData.dept).orderByChild('teacher').equalTo($rootScope.$storage.authData.uid);
      var adminAtt = FirebaseRef.child('attendances/'+$rootScope.$storage.userData.dept);
      var attRef;
      if($localStorage.userData.admin)
        attRef = adminAtt;
      else
        attRef = teachersAtt;
      attRef.once('value', function (snapshot) {
        $scope.attendances = snapshot.val();
        $scope.$apply();
        defer.resolve();
      }, function (err) {
        console.log(err);
        defer.reject();
      });
      return defer.promise;
    };

    var getStudents = function () {
      var defer = $q.defer();
      FirebaseRef.child('students/'+$rootScope.$storage.userData.dept).once('value', function (data) {
        students = data.val();
        defer.resolve();
      }, function (err) {
        defer.reject();
      });
      return defer.promise;
    };
    var getDepts = function () {
      var defer = $q.defer();
      FirebaseRef.child('departments').once('value', function (data) {
        $scope.depts = data.val();
        defer.resolve();
      }, function (err) {
        defer.reject();
      });
      return defer.promise;
    };
    var getSubjects = function () {
      var defer = $q.defer();
      FirebaseRef.child('subjects/'+$rootScope.$storage.userData.dept).once('value', function (data) {
        $scope.subjects = data.val();
        defer.resolve();
      }, function (err) {
        defer.reject();
      });
      return defer.promise;
    };

    $scope.loadAttendanceData = function () {
      var defer = $q.defer();
      getAttendances().then(function () {
        getStudents().then(function () {
          getDepts().then(function () {
            getSubjects().then(function () {

              defer.resolve();
            })
          })
        })
      });
      $scope.promise = defer.promise;
    };


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
    ];

    $scope.types = {
      th: 'Theory',
      pr: 'Practical'
    };

    /*$scope.showDept = function(dept) {
      /!*for(var deptid in $scope.depts)
      {
        if(dept == deptid)
          return $scope.depts[deptid]['name'];
      }*!/
      return $scope.depts[dept]['name'];
    }*/

    $scope.showYear = function(year) {
      var selected = [];
      if(year) {
        selected = $filter('filter')($scope.years, {id: year});
      }
      return selected.length ? selected[0].name : 'Not set';
    };

    $scope.showSem = function(sem) {
      return 'Semester '+sem;
    };

    $scope.showSub = function(sub) {
      for(var subid in $scope.subjects)
      {
        if(sub == subid)
        {
          return $scope.subjects[subid]['name'];
        }
      }
    };

    $scope.showType = function (item) {
      if (item.type == 'th')
        return 'Theory';
      else if (item.type == 'pr') {
        return 'Practical:  Batch ' + item.batchno;
      }
    };
//=======
    /*.controller('AttendancesCtrl', function ($rootScope, $scope, FirebaseRef, $q, $filter, $localStorage) {

        $rootScope.$storage = $localStorage;
        FirebaseRef.child('teachers/' + $localStorage.authData.uid).once('value')
            .then(function (snap) {
                $localStorage.userData = snap.val();
                $scope.$apply();
            });

        var students = {};

        var getAttendances = function () {
            $scope.attendances = [];
            var defer = $q.defer();
            FirebaseRef.child('attendances/' + $rootScope.$storage.userData.dept).orderByChild('teacher').equalTo($rootScope.$storage.authData.uid).once('value', function (snapshot) {
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
            FirebaseRef.child('students/' + $rootScope.$storage.userData.dept).once('value', function (data) {
                students = data.val();
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
//>>>>>>> b11b573ff31da36ab34d9186253d03d1f27ad36a
        }
        var getSubjects = function () {
            var defer = $q.defer();
            FirebaseRef.child('subjects/' + $rootScope.$storage.userData.dept).once('value', function (data) {
                $scope.subjects = data.val();
                defer.resolve();
            }, function (err) {
                defer.reject();
            });
            return defer.promise;
        }

        $scope.loadAttendanceData = function () {
            var defer = $q.defer();
            getAttendances().then(function () {
                getStudents().then(function () {
                    getDepts().then(function () {
                        getSubjects().then(function () {

                            defer.resolve();
                        })
                    })
                })
            });
            $scope.promise = defer.promise;
        };


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










        $scope.showDept = function (dept) {
            for (var deptid in $scope.depts) {
                if (dept == deptid)
                    return $scope.depts[deptid]['name'];
            }
        }

        $scope.showYear = function (year) {
            var selected = [];
            if (year) {
                selected = $filter('filter')($scope.years, { id: year });
            }
            return selected.length ? selected[0].name : 'Not set';
        }

        $scope.showSem = function (sem) {
            return 'Semester ' + sem;
        }

        $scope.showSub = function (sub) {
            for (var subid in $scope.subjects) {
                if (sub == subid) {
                    return $scope.subjects[subid]['name'];*/


        function natural(a, b) {
            var x = parseInt(a);
            var y = parseInt(b);
            if (x < y)
                return -1;
            else if (x > y)
                return 1;
            else
                return 0;
        }

        $scope.showAbsent = function (absentno) {
            var absent = [];
            if (typeof absentno != 'undefined') {
                absent = _.filter(students, function (s) { return _.includes(absentno, s.uid) });
                return _.map(absent, 'rollno').sort(natural).join(', ');
            }
            else if(typeof absentno == 'undefined') {
              console.log('undefined')
            }
            return "No absentees";
        };

        $scope.checkRoll = function (att, data) {
            //get roll no of students
            var studentrolls = _.chain(students).filter(function (s) {
                return s.year == att.year;
            }).map('rollno').sort(natural).value();
            //split string by , or   (there's a space here)
            var absents = data.split(/[ ,]+/);
            console.log(absents.length);
            //check validity of roll no
            if (_.every(absents, function (a) {
                return _.includes(studentrolls, a);
            })) {
            }
            else if (absents[0] == "") { }
            else return 'Some roll numbers are invalid';

        };

        var svRef = new Firebase('https://hazrisv.firebaseio.com');

        $scope.saveAtt = function (key, att, data) {

            console.log(key);
            console.log(att);
            console.log(data);

            //split string by , or   (there's a space here)
            var absentrolls = data.absentno.split(/[ ,]+/);
            var uids = _.chain(students).filter(function (s) { return s.year == att.year; }).map('uid').value();

            var absentuids = _.chain(students).filter(function (s) { return s.year == att.year && _.includes(absentrolls, s.rollno) }).map('uid').value();
            if (absentrolls[0] == "") absentuids = [];

            var presentuids = _.difference(uids, absentuids);

            var defer = $q.defer();
            //fetch old attendance before update
            FirebaseRef.child('attendances/' + $localStorage.userData.dept + '/' + key).once('value', function (snap) {
                var oldAtt = snap.val();
                console.log('old', oldAtt);

                //push old attendance in service queue
                svRef.child('serviceQueue/changed/old/' + key).update(oldAtt, function (err) {
                    if (!err) {
                        //update changes
                        var newAtt = {
                            absentno: absentuids,
                            date: data.date,
                            dept: att.dept,
                            noofhours: att.noofhours,
                            presentno: presentuids,
                            semester: att.semester,
                            subid: att.subid,
                            teacher: att.teacher,
                            timestamp: Firebase.ServerValue.TIMESTAMP,
                            topic: att.topic,
                            type: att.type,
                            year: att.year
                        };
                        console.log('new', newAtt);
                        FirebaseRef.child('attendances/' + $localStorage.userData.dept + '/' + key).update(newAtt, function (error) {
                            if (error) {
                                console.log(error);
                                defer.reject();
                            }
                            else {
                                $scope.attendances[key]['absentno'] = absentuids;
                                $scope.attendances[key]['presentno'] = presentuids;
                                svRef.child('serviceQueue/changed/new/' + key).update(newAtt, function (err) {
                                    if (!err) defer.resolve();
                                })
                            }
                        });
                    }
                    else defer.reject();
                });
            });
            return defer.promise;
        };


        $scope.deleteAtt = function (key, rowform) {
            console.log('del');
            console.log(key);
            FirebaseRef.child('attendances/' + $localStorage.userData.dept + '/' + key).remove();
            svRef.child('serviceQueue/rollback/' + key).update($scope.attendances[key], function (err) {
                if (!err) {
                    delete $scope.attendances[key];
                    rowform.$cancel();
                    $scope.$apply();
                }
            });
        };

        $scope.cancel = function (rowform) {
            rowform.$cancel();
        }

    });
