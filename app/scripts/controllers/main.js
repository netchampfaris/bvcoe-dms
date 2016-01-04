'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('MainCtrl', function (FirebaseRef, $scope, $location, $rootScope, $q, isNewUser) {

    $rootScope.authData = FirebaseRef.getAuth();

    $scope.depts = [];

    FirebaseRef.onAuth(function(authData) {
      if (authData) {
        isNewUser(authData).then(function(isNew) {
          console.log('new user: '+isNew);
          if(isNew) {
            FirebaseRef.child('teachers/'+$scope.reg.dept+'/'+authData.uid).set({
              name: $scope.reg.name
              //add other details if you want
            }, function() {
              if(tokenkey){
                FirebaseRef.child("tokens/"+tokenkey).remove(function () {
                  console.log('token removed '+tokenkey);
                });
              }
            });
          }
          console.log("Logged in as:", authData.uid);
          $location.path('/dashboard');

        }, function() {});


      } else {
        console.log("Logged out");
      }
    });

    $scope.login = {};
    $scope.login.message = '';
    $scope.login.success = true;
    $scope.login = function (user) {
      var defer = $q.defer();
      FirebaseRef.authWithPassword({
        "email": user.email,
        "password": user.pass
      }, function (error, authData) {
        if (error) {
          switch (error.code) {
            case "INVALID_PASSWORD":
              $scope.login.message = "The password is incorrect.";
              break;
            case "INVALID_EMAIL":
              $scope.login.message = "The specified email is not a valid email.";
              break;
            default:
              $scope.login.message = error;
          }
          $scope.login.success = false;
          defer.reject();
        } else {
          console.log("Authenticated successfully with payload:", authData);
          $scope.login.success = true;
          $scope.login.message = '';
          defer.resolve();
        }
      }, {
        remember: 'sessionOnly' /*later change it to sessionOnly*/
      });
      $scope.promise = defer.promise;
    };

    /*Register form*/

    $scope.message = {
      regSuccess : null,
      text : ''
    };
    var list = FirebaseRef.child('departments');
    list.on('value', function (snapshot) {
      for(var key in snapshot.val())
      {
        var curr = snapshot.val();
        $scope.depts.push({id:key, name:curr[key]['name']});
      }
      console.log('departments loaded');
    }, function (err) {
      console.log(err);
    });

    var tokenkey;

    $scope.register = function(reg) {
      var defer = $q.defer();
      list = FirebaseRef.child('tokens');
      list.once('value', function (tokens) {
        tokens = tokens.val();
        var token, isUsed, tokenFound = false;
        for(var key in tokens)
        {
          token = tokens[key]['token'];
          isUsed = tokens[key]['used'];
          if(reg.token == token &&  !isUsed){
            console.log('token match');
            tokenFound = true;
            tokenkey = key;
            registerUser(reg);
            break;
          }
        }
        if(!tokenFound)  {
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
        }, function(error, userData) {
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
