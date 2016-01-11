'use strict';

describe('Controller: GendefaulterCtrl', function () {

  // load the controller's module
  beforeEach(module('bvcoeDmsApp'));

  var GendefaulterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GendefaulterCtrl = $controller('GendefaulterCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GendefaulterCtrl.awesomeThings.length).toBe(3);
  });
});
