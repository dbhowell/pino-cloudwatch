require('chai').should();
var mockRequire = require('mock-require');
mockRequire('aws-sdk', require('../mocks/aws-sdk'));

var fs = require('fs');
var path = require('path');
var pump = require('pump');
var split = require('split2');
var StdoutStream = require('../../lib/stdout-stream');

describe('stdout-stream', function () {
  it('should copy input to stdout', function (done) {
    var didLog = false;
    var inStream = fs.createReadStream(path.resolve(__dirname, '../mocks/logs.txt'));
    var mockConsole = {
      log: function (/*message*/) {
        didLog = true;
      }
    };
    var stream = new StdoutStream({ stdout: true, console: mockConsole });

    pump(inStream, split(), stream, function (err) {
      didLog.should.be.true;
      done(err);
    });
  });

  it('should not copy input to stdout', function (done) {
    var didLog = false;
    var mockConsole = {
      log: function (/*message*/) {
        didLog = true;
      }
    };
    var stream = new StdoutStream({ stdout: false, console: mockConsole });
    var inStream = fs.createReadStream(path.resolve(__dirname, '../mocks/logs.txt'));

    pump(inStream, split(), stream, function (err) {
      didLog.should.be.false;
      done(err);
    });
  });
});
