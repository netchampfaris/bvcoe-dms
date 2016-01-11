'use strict';

describe('Service: XSLXReaderService', function () {

  // load the service's module
  beforeEach(module('bvcoeDmsApp'));

  // instantiate service
  var XSLXReaderService;
  beforeEach(inject(function (_XSLXReaderService_) {
    XSLXReaderService = _XSLXReaderService_;
  }));

  it('should do something', function () {
    expect(!!XSLXReaderService).toBe(true);
  });

});
