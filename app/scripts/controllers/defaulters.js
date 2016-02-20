'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:DefaultersCtrl
 * @description
 * # DefaultersCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('DefaultersCtrl', function ($scope, FirebaseRef, $q, $uibModal, firebaseurl, $http) {

    $scope.sms = {
      success: false
    };

    $scope.depts = [];
    $scope.years = [
      {
        id: 1,
        name: "First Year"
      },
      {
        id: 2,
        name: "Second Year"
      },
      {
        id: 3,
        name: "Third Year"
      },
      {
        id: 4,
        name: "Final Year"
      }
    ];

    $scope.form = {};

    var defer = $q.defer();
    FirebaseRef.child('departments').once('value', function (snapshot) {
      for(var key in snapshot.val())
      {
        var curr = snapshot.val();
        $scope.depts.push({id:key, name:curr[key]['name']});
      }
      defer.resolve();
    }, function (err) {
      console.log(err);
      defer.reject();
    });
    $scope.deptpromise = defer.promise;


    $scope.defaulters = [];
    $scope.loadDefaulters = function(form) {
      var dept = form.dept, sem = form.sem, year;
      console.log(form);
      switch (form.year) {
        case "1": year = "fe"; break;
        case "2": year = "se"; break;
        case "3": year = "te"; break;
        case "4": year = "be"; break;
      }
      var deferred = $q.defer();

      $http({
        method: 'GET',
        url: firebaseurl+'/defaulters/'+dept+'/.json?shallow=true'
      }).then(function successCallback(response) {

        //console.log(response);
        var defaulters = [];
        for(var key in response.data)
        {
          var res = key.split("-");
          //console.log(res);
          if(dept == res[1] && year == res[2] && sem == res[3].substr(3))
            defaulters.push({
              key: key,
              dept: res[1],
              year: res[2],
              sem: res[3].substr(3),
              date: res[4]+'-'+res[5]+'-'+res[6]
            });
        }
        $scope.defaulters = defaulters;
        deferred.resolve();
        console.log($scope.defaulters);
      }, function errorCallback(response) {
        console.log(response);
        deferred.reject();
      });
      $scope.promise = deferred.promise;
    };

    $scope.download = function(item) {
      FirebaseRef.child('defaulters/'+item.dept+'/'+item.key+'/excel').once('value', function (data) {
        window.open (data.val(), '_blank');
      });
    };

    $scope.viewDefaulters = function (item) {

      FirebaseRef.child('defaulters/'+item.dept+'/'+item.key+'/percentData').once('value', function (data) {
        var percentData = data.val();

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'views/modals/mymodal.html',
          controller: 'ModalCtrl',
          size: 'lg',
          resolve: {
            defaulters: function () {
              return percentData;
            }
          }
        });

        modalInstance.result.then(function (smssent) {
          $scope.sms.success = smssent;
          console.log(smssent);
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
      });

    };

  });
