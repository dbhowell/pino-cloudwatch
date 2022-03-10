var ChunkyStream = require('chunky-stream');
var StdoutStream = require('./lib/stdout-stream');
var ThrottleStream = require('./lib/throttle-stream');
var CloudWatchStream = require('./lib/cloudwatch-stream');

module.exports = function (options, errorHandler) {
  options = options || {};
  options.ignoreEmpty = true;
  options.interval = typeof options.interval === 'undefined'
    ? 1000
    : options.interval;

  var log = new CloudWatchStream(options);
  var chunk = new ChunkyStream(options);
  var throttle = new ThrottleStream();
  var stdout = new StdoutStream(options);

  chunk.use(require('./lib/max-length'));
  chunk.use(require('./lib/max-size'));

  if (typeof errorHandler === 'function') {
    log.on('error', errorHandler);
  }

  log.on('flushed', function () {
    stdout.emit('flushed')
  });

  stdout.pipe(chunk).pipe(throttle).pipe(log);

  return stdout;
};
