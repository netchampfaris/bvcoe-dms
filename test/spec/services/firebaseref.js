'use strict';

describe('Service: FirebaseRef', function () {

  // load the service's module
  beforeEach(module('bvcoeDmsApp'));

  // instantiate service
  var FirebaseRef;
  beforeEach(inject(function (_FirebaseRef_) {
    FirebaseRef = _FirebaseRef_;
  }));

  it('should do something', function () {
    expect(!!FirebaseRef).toBe(true);
  });

});
