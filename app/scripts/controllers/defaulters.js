'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:DefaultersCtrl
 * @description
 * # DefaultersCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('DefaultersCtrl', function ($scope, FirebaseRef) {

    var deptid = 'cs';
    var batchcount = '4';

    $scope.count = {
      th:0,
      pr:0
    };
    var defaulters = {};
    $scope.defaulterTable = {};

    var defaultersRef = FirebaseRef.child('defaulters/'+deptid);
    defaultersRef.once('value', function (snapshot) {

      defaulters = snapshot.val();
      for (var x in defaulters) {
        $scope.defaulterTable = defaulters[x];
        $scope.defaulterTable.name = x;
        break;
      }
      console.log($scope.defaulterTable);

      for(x in $scope.defaulterTable)
      {
        if($scope.defaulterTable.hasOwnProperty(x)){

          if(x == 'attDataTh'){
            for(var y in $scope.defaulterTable[x])
              if(($scope.defaulterTable[x]).hasOwnProperty(y))
              {
                $scope.count.th++;
              }
          }
          if(x == 'attDataPr'){
            for(var y in $scope.defaulterTable[x])
              if(($scope.defaulterTable[x]).hasOwnProperty(y))
              {
                $scope.count.pr++;
              }
          }

        }
      }
      $scope.$apply();

      $scope.defaulterTable.totalTheoryHeld = 0;
      for(var i=0; i<$scope.count.th; i++)
      {
        $scope.defaulterTable.totalTheoryHeld += parseInt(angular.element($('#thTotalAtt'+i)).html());
        $scope.$apply();
      }
      for(var i=0; i<$scope.count.pr; i++)
      {
        $scope.defaulterTable.totalPracticalHeld += parseInt(angular.element($('#prTotalAtt'+i)));
        /*for(var j=0; j<batchcount; j++)
        {
        }*/
      }

    }, function (err) {
        console.log(err);
    });



  });
