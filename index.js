var pump = require('pump');
var ChunkyStream = require('chunky-stream');
var CloudWatchStream = require('./lib/cloudwatch-stream');
var ThrottleStream = require('./lib/throttle-stream');

module.exports = function (options) {
  var log = new CloudWatchStream(options);
  var chunk = new ChunkyStream(options);
  var throttle = new ThrottleStream();

  chunk.use(require('./lib/max-length'));
  chunk.use(require('./lib/max-size'));

  return pump(chunk, throttle, log, function (err) {
    if (err) {
      console.error(err);
    }
  });
};
