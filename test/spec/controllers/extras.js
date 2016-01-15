'use strict';

describe('Controller: ExtrasCtrl', function () {

  // load the controller's module
  beforeEach(module('bvcoeDmsApp'));

  var ExtrasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExtrasCtrl = $controller('ExtrasCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ExtrasCtrl.awesomeThings.length).toBe(3);
  });
});
