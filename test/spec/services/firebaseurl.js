'use strict';

describe('Service: firebaseurl', function () {

  // load the service's module
  beforeEach(module('bvcoeDmsApp'));

  // instantiate service
  var firebaseurl;
  beforeEach(inject(function (_firebaseurl_) {
    firebaseurl = _firebaseurl_;
  }));

  it('should do something', function () {
    expect(!!firebaseurl).toBe(true);
  });

});
