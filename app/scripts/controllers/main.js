'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('MainCtrl', function (FirebaseRef, $scope, $location, $rootScope, $q) {

    $rootScope.authData = FirebaseRef.getAuth();

    $scope.depts = [];

    FirebaseRef.onAuth(function(authData) {
      if (authData) {
        isNewUser(authData).then(function(isNew) {
          if(isNew)
            FirebaseRef.child('teachers/'+$scope.reg.dept+'/'+authData.uid).set({
              name: $scope.reg.name
            });
        }, function() {});

        console.log("Logged in as:", authData.uid);
        $location.path('/dashboard');
      } else {
        console.log("Logged out");
      }
    });

    var isNewUser = function(authData) {
      var defer = $q.defer();
      var isNew = true;
      FirebaseRef.child('teachers').once('value', function(snapshot) {
        for(var dept in snapshot.val())
        {
          for(var uid in snapshot.val()[dept]) {
            console.log(uid);
            if(authData.uid == uid){
              isNew = false;
            }
          }
        }
        defer.resolve(isNew);
      }, function(err) {
        console.log(err);
        defer.reject();
      });
      return defer.promise;
    };

    $scope.login = function (user) {
      var defer = $q.defer();
      console.log(user);
      FirebaseRef.authWithPassword({
        "email": user.email,
        "password": user.pass
      }, function (error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          defer.reject();
        } else {
          console.log("Authenticated successfully with payload:", authData);
          defer.resolve();
        }
      }, {
        remember: 'default' /*later change it to sessionOnly*/
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
          console.log(token);
          if(reg.token == token &&  !isUsed){
            console.log('token match');
            tokenFound = true;
            registerUser(reg);
            break;
          }
        }
        if(!tokenFound)  {
          console.log('token invalid');
          $scope.message.text = "Token Invalid";
          $scope.message.regSuccess = false;
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
