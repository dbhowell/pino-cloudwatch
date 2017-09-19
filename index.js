var pump = require('pump');
var split = require('split2');
var ChunkyStream = require('chunky-stream');
var CloudWatchStream = require('./lib/cloudwatch-stream');

module.exports = function (options) {
  var log = new CloudWatchStream(options);
  var chunk = new ChunkyStream(options);

  chunk.use(require('./lib/max-length'));
  chunk.use(require('./lib/max-size'));

  return pump(process.stdin, split(), chunk, log, function (err) {
    if (err) {
      console.error(err);
    }
  });
};
