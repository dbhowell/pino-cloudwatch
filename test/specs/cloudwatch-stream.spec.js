require('chai').should();
var mockRequire = require('mock-require');
mockRequire('aws-sdk', require('../mocks/aws-sdk'));

var fs = require('fs');
var path = require('path');
var pump = require('pump');
var split = require('split2');
var CloudWatchStream = require('../../lib/cloudwatch-stream');

describe('cloudwatch-stream', function () {
  it('should error if no Log Group name specified', function () {
    try {
      pump(CloudWatchStream({}), function (err) {
        if (err) {
          console.log(err);
        }
      });
    } catch (err) {
      err.should.not.be.null;
    }
  });

  it('should send the chunks to CloudWatch Logs', function (done) {
    var stream = new CloudWatchStream({ group: 'test' });
    var inStream = fs.createReadStream(path.resolve(__dirname, '../mocks/logs.txt'));

    pump(inStream, split(), stream, function (err) {
      done(err);
    });
  });

  it('should recover from an InvalidSequenceTokenException', function (done) {
    var stream = new CloudWatchStream({ group: 'test', aws_region: 'InvalidSequenceTokenException' });
    var inStream = fs.createReadStream(path.resolve(__dirname, '../mocks/logs.txt'));

    pump(inStream, split(), stream, function (err) {
      done(err);
    });
  });

  it('should emit a flushed event', function (done) {
    var stream = new CloudWatchStream({ group: 'test' });
    var inStream = fs.createReadStream(path.resolve(__dirname, '../mocks/log_single.txt'));

    stream.on('flushed', function () {
      done();
    });
  
    pump(inStream, split(), stream);
  });
});
