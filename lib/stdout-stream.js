var Transform = require('readable-stream/transform');
var util = require('util');

function StdoutStream (options) {
  if (!(this instanceof StdoutStream)) {
    return new StdoutStream(options);
  }

  options = options || {};
  options.objectMode = true;
  options.writeableObjectMode = true;
  options.readableObjectMode = true;

  this.console = options.console || console;
  this.stdout = options.stdout || false;

  Transform.call(this, options);
}

util.inherits(StdoutStream, Transform);

StdoutStream.prototype.flush = function (callback) {
  if (callback) {
    return callback();
  }
};

StdoutStream.prototype._transform = function (chunk, encoding, callback) {
  if (this.stdout) this.console.log(chunk);

  callback(null, chunk);
};

StdoutStream.prototype._flush = function (callback) {
  this.flush(callback);
};

module.exports = StdoutStream;
