var ChunkyStream = require('chunky-stream');
var StdoutStream = require('./lib/stdout-stream');
var ThrottleStream = require('./lib/throttle-stream');
var CloudWatchStream = require('./lib/cloudwatch-stream');

module.exports = function (options, events) {
  options = options || {};
  events = events || {};
  options.ignoreEmpty = true;

  var log = new CloudWatchStream(options);
  var chunk = new ChunkyStream(options);
  var throttle = new ThrottleStream();
  var stdout = new StdoutStream(options);

  chunk.use(require('./lib/max-length'));
  chunk.use(require('./lib/max-size'));

  Object.entries(events).forEach(([event, handler]) => {
    if (typeof handler === 'function') {
      log.on(event, handler);
    }
  });

  stdout.pipe(chunk).pipe(throttle).pipe(log);

  return stdout;
};
