'use strict';

/**
 * @ngdoc function
 * @name bvcoeDmsApp.controller:ModalctrlCtrl
 * @description
 * # ModalctrlCtrl
 * Controller of the bvcoeDmsApp
 */
angular.module('bvcoeDmsApp')
  .controller('ModalCtrl', function (defaulters, $scope, $q, $http, $uibModalInstance) {

    $scope.students = defaulters;

    $scope.checkDefaulter = function (percent) {
      //console.log(percent);
      if(percent < '75'){
        return true;
      }
      else return false;

    };


    $scope.sendmessage = function (students) {
      var dfd = $q.defer();

      var numbers = '';
      var message = 'Your wards attendance is lower than 75%';
      message = encodeURI(message);
      for(var uid in students)
      {
        //console.log(student);
        var student = students[uid];
        if(student.percent < '75' && student.pphone.length == 10)
        {
          console.log(student.name+" => "+student.percent+"% => "+student.pphone);
          numbers += '91'+student.pphone+',';
        }
        if(student.percent < '75' && student.pphone.length != 10)
        {
          console.log('Invalid phone number => '+student.name+" => "+student.percent+"% => "+student.pphone);
        }
      }
      numbers = numbers.slice(0, -1);
      //console.log(numbers);
      //numbers = '918976196108,917387405603';

      var url = "http://smsc.smsconnexion.com/api/gateway.aspx?" +
                "action=send" +
                "&username=bharati" +
                "&passphrase=123456" +
                "&message=" + message +
                "&phone=" + numbers;

      //console.log(url);
      //$uibModalInstance.close(true);
      $http({
        method: 'GET',
        url: url
      }).then(function successCallback(response) {
        console.log(response);
        dfd.resolve();
        //alert('Defaulter generated successfully');
        $uibModalInstance.close(true);
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(response);
        dfd.reject();
        $uibModalInstance.close(false);
      });
      $scope.sendsms = dfd.promise;
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
