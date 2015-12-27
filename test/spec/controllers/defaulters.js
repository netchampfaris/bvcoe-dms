'use strict';

describe('Controller: DefaultersCtrl', function () {

  // load the controller's module
  beforeEach(module('bvcoeDmsApp'));

  var DefaultersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DefaultersCtrl = $controller('DefaultersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DefaultersCtrl.awesomeThings.length).toBe(3);
  });
});
