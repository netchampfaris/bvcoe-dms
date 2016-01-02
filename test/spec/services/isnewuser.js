'use strict';

describe('Service: isNewUser', function () {

  // load the service's module
  beforeEach(module('bvcoeDmsApp'));

  // instantiate service
  var isNewUser;
  beforeEach(inject(function (_isNewUser_) {
    isNewUser = _isNewUser_;
  }));

  it('should do something', function () {
    expect(!!isNewUser).toBe(true);
  });

});
