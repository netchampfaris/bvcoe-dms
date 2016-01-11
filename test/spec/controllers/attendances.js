'use strict';

describe('Controller: AttendancesCtrl', function () {

  // load the controller's module
  beforeEach(module('bvcoeDmsApp'));

  var AttendancesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AttendancesCtrl = $controller('AttendancesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AttendancesCtrl.awesomeThings.length).toBe(3);
  });
});
