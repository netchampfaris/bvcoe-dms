'use strict';

describe('Service: FirebaseAuth', function () {

  // load the service's module
  beforeEach(module('bvcoeDmsApp'));

  // instantiate service
  var FirebaseAuth;
  beforeEach(inject(function (_FirebaseAuth_) {
    FirebaseAuth = _FirebaseAuth_;
  }));

  it('should do something', function () {
    expect(!!FirebaseAuth).toBe(true);
  });

});
