'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:DefaultersCtrl
 * @description
 * # DefaultersCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('DefaultersCtrl', function ($scope, FirebaseRef, $q, $http) {


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
    FirebaseRef.child('departments').on('value', function (snapshot) {
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
      $http({
        method: 'GET',
        url: 'http://cors.io/?u=http://bvcoeportal.orgfree.com/defaulters/defaulter_api.php/'+dept+'/'+year+'/'+sem
      }).then(function successCallback(response) {
        console.log(response);
        var arrayLength = response.data.length;
        var defaulters = [];
        for (var i = 0; i < arrayLength; i++) {
          var res = response.data[i]['name'].split("-");
          console.log(res);
          defaulters.push({
            dept: res[1].toUpperCase(),
            year: res[2].toUpperCase(),
            sem: res[3].substr(3),
            date: res[4]+'-'+res[5]+'-'+res[6],
            link: response.data[i]['link']
          });
        }
        console.log(defaulters);
        $scope.defaulters = defaulters;
      }, function errorCallback(response) {
        console.log(response);
      });

    }



  });
