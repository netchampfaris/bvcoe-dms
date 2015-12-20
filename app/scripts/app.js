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
    'firebase'
  ])
  .config(function ($routeProvider) {
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
      .otherwise({
        redirectTo: '/'
      });
  });
