'use strict';

describe('NF-BARCODE-SCANNER SERVICE', function () {
  var BarcodeScanner;

  beforeEach(function () {
    module('nf.barcode-scanner');
  });

  beforeEach(inject(function (_BarcodeScannerService_) {
    BarcodeScanner = _BarcodeScannerService_;
  }));

  it('Test cases skeleton', function () {
  });
});
