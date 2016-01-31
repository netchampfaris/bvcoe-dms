'use strict';

/**
 * @ngdoc filter
 * @name bvcoeDmsApp.filter:objectFilter
 * @function
 * @description
 * # objectFilter
 * Filter in the bvcoeDmsApp.
 */
angular.module('bvcoeDmsApp')
  .filter('objectFilter', function () {
    return function (items, search) {
      console.log('search:', search);
      if(search == null || typeof search == 'undefined')
        return items;
      var result = {};
      angular.forEach(items, function (value, key) {
        if(value.year == search.year && value.type == search.type){
          result[key] = value
        }
      });
      return result;

    }
  });
