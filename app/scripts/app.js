'use strict';

/**
 * @ngdoc overview
 * @name bvcoeDmsApp
 * @description
 * # bvcoeDmsApp
 *
 * Main module of the application.
 */
angular
  .module('bvcoeDmsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'cgBusy',
    'ngStorage',
    'xeditable',
    'ui.bootstrap',
    'angular-confirm'
  ])
  .run(function($rootScope, FirebaseRef, FirebaseAuth, $location, $localStorage, editableOptions, $route) {
    $rootScope.$storage = $localStorage;
    $rootScope.$storage.authData = FirebaseRef.getAuth();

    FirebaseRef.onAuth(function(authData) {
      if (authData) {
        console.log("Logged in as:", authData.uid);
        $location.path('/attendances');
      } else {
        console.log("Logged out");
      }
      $rootScope.$storage.authData = FirebaseRef.getAuth();
    });

    $rootScope.logout = function () {
      FirebaseRef.unauth();
      delete $rootScope.$storage.authData;
      delete $rootScope.$storage.userData;
      $location.path('/')
    };

    editableOptions.theme = 'bs3';

  })
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve: {
          // controller will not be loaded until $waitForAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["FirebaseAuth",
            function (FirebaseAuth) {
              // $waitForAuth returns a promise so the resolve waits for it to complete
              return FirebaseAuth.$waitForAuth();
            }]
        }
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard',
        resolve: {
          // controller will not be loaded until $requireAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["FirebaseAuth", function(FirebaseAuth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return FirebaseAuth.$requireAuth();
          }]
        }
      })
      .when('/defaulters', {
        templateUrl: 'views/defaulters.html',
        controller: 'DefaultersCtrl',
        controllerAs: 'defaulters'
      })
      .when('/dataentry', {
        templateUrl: 'views/dataentry.html',
        controller: 'DataentryCtrl',
        controllerAs: 'dataentry',
        resolve: {
          // controller will not be loaded until $requireAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["FirebaseAuth", function(FirebaseAuth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return FirebaseAuth.$requireAuth();
          }]
        }
      })
      .when('/attendances', {
        templateUrl: 'views/attendances.html',
        controller: 'AttendancesCtrl',
        controllerAs: 'attendances',
        resolve: {
          // controller will not be loaded until $requireAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["FirebaseAuth", function(FirebaseAuth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return FirebaseAuth.$requireAuth();
          }]
        }
      })
      .when('/genDefaulter', {
        templateUrl: 'views/gendefaulter.html',
        controller: 'GendefaulterCtrl',
        controllerAs: 'genDefaulter',
        resolve: {
          // controller will not be loaded until $requireAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["FirebaseAuth", function(FirebaseAuth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return FirebaseAuth.$requireAuth();
          }]
        }
      })
      .when('/takeAttendance',{
          templateUrl:'views/takeAttendance.html',
          controller: 'TakeAttendanceCtrl',
        controllerAs: 'takeAttendance',
        resolve: {
          // controller will not be loaded until $requireAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["FirebaseAuth", function(FirebaseAuth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return FirebaseAuth.$requireAuth();
          }]
        }
      })

      .when('/extras', {
        templateUrl: 'views/extras.html',
        controller: 'ExtrasCtrl',
        controllerAs: 'extras',
        resolve: {
          // controller will not be loaded until $requireAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["FirebaseAuth", function(FirebaseAuth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return FirebaseAuth.$requireAuth();
          }]
        }
      })
      .otherwise({
        redirectTo: '/attendances'
      });
  });
