'use strict';

describe('Controller: ModalctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('bvcoeDmsApp'));

  var ModalctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModalctrlCtrl = $controller('ModalctrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ModalctrlCtrl.awesomeThings.length).toBe(3);
  });
});
