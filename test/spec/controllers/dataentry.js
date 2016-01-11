'use strict';

describe('Controller: DataentryCtrl', function () {

  // load the controller's module
  beforeEach(module('bvcoeDmsApp'));

  var DataentryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DataentryCtrl = $controller('DataentryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DataentryCtrl.awesomeThings.length).toBe(3);
  });
});
