(function () {
  'use strict';

  angular
    .module('nf.barcode-scanner', [])
    .factory('BarcodeScannerService', BarcodeScannerService);

  BarcodeScannerService.$inject = ['$q'];

  function BarcodeScannerService($q) {
    var service = {
      scan: scan
    };
    return service;

    function scan(config) {
      var result,
        deferred = $q.defer(),
        options = angular.extend({
          preferFrontCamera: false,
          showFlipCameraButton: false,
          prompt: 'Place a barcode inside the scan area',
          formats: 'UPC_A,UPC_E,EAN_8,EAN_13,CODE_128,QR_CODE'
        }, config);

      try {
        if (Array.isArray(options.formats)) {
          if (options.formats.length === 0) {
            return $q.reject('formats array cannot be empty.');
          }

          options.formats = options.formats.toString();
        }

        cordova.plugins.barcodeScanner.scan(function (result) {
          result = {
            data: result.text,
            format: result.format,
            cancelled: result.cancelled
          };
          deferred.resolve(result);
        }, deferred.reject, options);
      } catch (err) {
        deferred.reject(err);
      }

      return deferred.promise;
    }
  }
})();
