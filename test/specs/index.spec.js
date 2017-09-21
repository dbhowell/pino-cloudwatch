var mockRequire = require('mock-require');
mockRequire('aws-sdk', require('../mocks/aws-sdk'));
var index = require('../../index');
var fs = require('fs');
var path = require('path');

describe('pino-cloudwatch', function () {
  it('should send logs to CloudWatch Logs', function (done) {
    var inStream = fs.createReadStream(path.resolve(__dirname, '../mocks/logs.txt'));
    var pump = require('pump');
    var split = require('split2');

    pump(inStream, split(), index({ group: 'test' }), function (err) {
      done(err);
    });
  });
});
