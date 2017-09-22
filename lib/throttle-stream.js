var Transform = require('readable-stream/transform');
var util = require('util');

function ThrottleStream (options) {
  if (!(this instanceof ThrottleStream)) {
    return new ThrottleStream(options);
  }

  options = options || {};
  options.objectMode = true;
  options.writeableObjectMode = true;
  options.readableObjectMode = true;

  this.lastTime = 0;
  this.interval = (1000 / 5);
  this.timeoutId = null;
  this.buffer = [];

  Transform.call(this, options);
}

util.inherits(ThrottleStream, Transform);

ThrottleStream.prototype.flush = function (callback) {
  if (this.buffer.length > 0) {
    var chunk = this.buffer.shift();
    this.push(chunk);

    if (this.buffer.length > 0) {
      this.timeoutId = setTimeout(this.flush.bind(this, callback), this.interval);
    } else {
      if (callback) {
        return callback();
      }
    }
  }
};

ThrottleStream.prototype._transform = function (chunk, encoding, callback) {
  this.buffer.push(chunk);
  this.timeoutId = setTimeout(this.flush.bind(this, callback), this.interval);
};

ThrottleStream.prototype._flush = function (callback) {
  this.flush(callback);
};

module.exports = ThrottleStream;
