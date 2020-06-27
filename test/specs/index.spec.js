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

  it('should not send logs to CloudWatch Logs', function (done) {
    var inStream = fs.createReadStream(path.resolve(__dirname, '../mocks/log_empty.txt'));
    var pump = require('pump');
    var split = require('split2');

    pump(inStream, split(), index({ group: 'test' }), function (err) {
      done(err);
    });
  });

  it('should emit a flushed event', function (done) {
    var inStream = fs.createReadStream(path.resolve(__dirname, '../mocks/log_single.txt'));
    var pump = require('pump');
    var split = require('split2');
    var pinoCloudwatch = index({ group: 'test' });

    pinoCloudwatch.on('flushed', function () {
      done();
    });

    pump(inStream, split(), pinoCloudwatch);
  });
});
