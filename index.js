var pump = require('pump');
var ChunkyStream = require('chunky-stream');
var CloudWatchStream = require('./lib/cloudwatch-stream');

module.exports = function (options) {
  var log = new CloudWatchStream(options);
  var chunk = new ChunkyStream(options);

  chunk.use(require('./lib/max-length'));
  chunk.use(require('./lib/max-size'));

  return pump(chunk, log, function (err) {
    if (err) {
      console.error(err);
    }
  });
};
