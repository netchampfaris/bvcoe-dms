'use strict';

describe('Controller: EyellowbookCtrl', function () {

  // load the controller's module
  beforeEach(module('bvcoeDmsApp'));

  var EyellowbookCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EyellowbookCtrl = $controller('EyellowbookCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EyellowbookCtrl.awesomeThings.length).toBe(3);
  });
});
