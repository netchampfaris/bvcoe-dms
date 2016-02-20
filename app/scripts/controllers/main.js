'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
    .controller('MainCtrl', function (FirebaseRef, $scope, $location, $rootScope, $q, $localStorage) {

        $scope.$storage = $localStorage;

        $scope.depts = [];
        $scope.years = [];
        $scope.sems = [];

      var teacherData = {};


      function newUser() {
        console.log('newUser');
        function updateTeacherData() {
          //console.log(teacherData);
          return FirebaseRef.child('teachers/'+$localStorage.authData.uid).update({
            name: teacherData.name,
            role: teacherData.teacherrole || null,
            dept: teacherData.dept,
            year: teacherData.year || null
          });
        }
        updateTeacherData()
          .then(function () {
            console.log('destroy token');
            return FirebaseRef.child('tokens/' + tokenkey).remove();  //remove token
          })/*
          .then(function () {
            return existingUser();
          })*/;
      }

      function existingUser() {
        console.log('existingUser');
        return FirebaseRef.child('teachers/' + $localStorage.authData.uid).once('value');
      }

      FirebaseRef.onAuth(function (authData) {
        $localStorage.authData = authData;
        if(authData){
          FirebaseRef.child('teachers/'+authData.uid).once('value')
            .then(function (snap) {
              return (snap.val()) ? false : true;  //check if newUser
            })
            .then(function(isNewUser) {
              console.log('isNewUser');
              if(isNewUser)
                return newUser();/*
              else
                return existingUser();*/
            })
            .then(function () {
              console.log('userData');
              $location.path('/attendances');
              $scope.$apply();
            });
        }
      });

        $scope.loginResult = {
          message: '',
          success: true
        };

        $scope.login = function (user) {
          var defer = $q.defer();

          function login() {
            return FirebaseRef.authWithPassword({
              "email": user.email,
              "password": user.pass
            },{
              remember: 'sessionOnly'
            })
          }

          login()
            .then(function (authData) {
              //console.log(authData);
              $scope.loginResult = {
                success: true,
                message: ''
              };
              defer.resolve();
            }, function (err) {
              console.log(err);
              $scope.loginResult = {
                success: false,
                message: err.message
              };
              defer.reject();
            });
          $scope.promise = defer.promise;
        };

        /*Register form*/

        $scope.message = {
            regSuccess: null,
            text: ''
        };

        var list = FirebaseRef.child('departments');
        list.once('value', function (snapshot) {
          for (var key in snapshot.val()) {
                var curr = snapshot.val();
                $scope.depts.push({ id: key, name: curr[key]['name'] });
          }

          FirebaseRef.child('year').once('value', function (years) {
            years = years.val();
            for(var year in years){
              $scope.years.push({ id:year, name: years[year]['name'] });
            }


          });

          console.log('departments loaded');
        }, function (err) {
            console.log(err);
        });

        var tokenkey;

        $scope.register = function (reg) {
          teacherData = _.cloneDeep(reg);

            var defer = $q.defer();
            list = FirebaseRef.child('tokens');
            list.once('value', function (tokens) {
                tokens = tokens.val();
                var token, isUsed, tokenFound = false;
                for (var key in tokens) {
                    token = tokens[key]['token'];
                    isUsed = tokens[key]['used'];
                    if (reg.token == token && !isUsed) {
                        console.log('token match');
                        tokenFound = true;
                        tokenkey = key;
                        registerUser(reg);
                        break;
                    }
                }
                if (!tokenFound) {
                    console.log('token invalid');
                    $scope.message.text = "Token Invalid";
                    $scope.message.regSuccess = false;
                    defer.reject();
                }
            }, function (err) {
                console.log(err);
                defer.reject();
            });

            var registerUser = function (user) {
                FirebaseRef.createUser({
                    email: user.email,
                    password: user.pass
                }, function (error, userData) {
                    if (error) {
                        switch (error.code) {
                            case "EMAIL_TAKEN":
                                $scope.message.text = "The new user account cannot be created because the email is already in use.";
                                break;
                            case "INVALID_EMAIL":
                                $scope.message.text = "The specified email is not a valid email.";
                                break;
                            default:
                                $scope.message.text = error;
                        }
                        $scope.message.regSuccess = false;
                        defer.reject();
                    } else {
                        console.log("Successfully created user account with uid:", userData.uid);
                        $scope.message.regSuccess = true;
                        $scope.message.text = "Registration completed successfully!";
                        /*$scope.regform.$setPristine();
                        $scope.reg = {};*/
                        $scope.login(user);
                        defer.resolve();
                    }
                });
            };

            $scope.regpromise = defer.promise;
        };

    });
