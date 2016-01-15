'use strict';

/**
 * @ngdoc filter
 * @name bvcoeDmsApp.filter:orderObjectBy
 * @function
 * @description
 * # orderObjectBy
 * Filter in the bvcoeDmsApp.
 */
angular.module('bvcoeDmsApp')

  .filter('orderObjectBy', function() {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        var x = a[field];
        var y = b[field];
        if(!isNaN(x) &&!isNaN(y)){
          x = parseInt(x), y = parseInt(y);
        }
        return (x > y ? 1 : -1);
      });
      if(reverse) filtered.reverse();
      return filtered;
    };
  });
