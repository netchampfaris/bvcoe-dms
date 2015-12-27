'use strict';

describe('Service: FbArray', function () {

  // load the service's module
  beforeEach(module('bvcoeDmsApp'));

  // instantiate service
  var FbArray;
  beforeEach(inject(function (_FbArray_) {
    FbArray = _FbArray_;
  }));

  it('should do something', function () {
    expect(!!FbArray).toBe(true);
  });

});
