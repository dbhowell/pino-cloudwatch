var util = require('util');
var async = require('async');
var map = require('lodash.map');
var AWS = require('aws-sdk');
var Writable = require('stream').Writable;

function CloudWatchStream (options) {
  if (!(this instanceof CloudWatchStream)) {
    return new CloudWatchStream(options);
  }

  options.objectMode = true;

  this.logGroupName = options.group;
  this.logStreamName = 'testing';
  this.nextSequenceToken = null;

  this.cloudWatchLogs = new AWS.CloudWatchLogs({
    region: options.aws_region,
    accessKeyId: options.aws_access_key_id,
    secretAccessKey: options.aws_secret_access_key
  });

  Writable.call(this, options);
}

CloudWatchStream.prototype.createLogGroup = function (options, callback) {
  if (options.nextSequenceToken) {
    return callback(null, options);
  }

  this.cloudWatchLogs.createLogGroup({
    logGroupName: options.logGroupName
  }, function (err, data) {
    if (err && err.code === 'ResourceAlreadyExistsException') {
      err = null;
    }

    callback(err, options);
  });
};

CloudWatchStream.prototype.createLogStream = function (options, callback) {
  if (options.nextSequenceToken) {
    return callback(null, options);
  }

  this.cloudWatchLogs.createLogStream({
    logGroupName: options.logGroupName,
    logStreamName: options.logStreamName
  }, function (err, data) {
    if (err && err.code === 'ResourceAlreadyExistsException') {
      err = null;
    }

    callback(err, options);
  });
};

CloudWatchStream.prototype.nextToken = function (options, callback) {
  if (options.nextSequenceToken) {
    return callback(null, options);
  }

  this.cloudWatchLogs.describeLogStreams({
    logGroupName: options.logGroupName,
    logStreamNamePrefix: options.logStreamName
  }, function (err, data) {
    if (err) {
      return callback(err);
    }

    if (data.logStreams.length === 0) {
      return callback(new Error('LogStream not found.'));
    }

    options.nextSequenceToken = data.logStreams[0].uploadSequenceToken;
    callback(err, options);
  });
};

CloudWatchStream.prototype.putLogEvents = function (options, callback) {
  this.cloudWatchLogs.putLogEvents({
    logEvents: options.logEvents,
    logGroupName: options.logGroupName,
    logStreamName: options.logStreamName,
    sequenceToken: options.nextSequenceToken
  }, function (err, data) {
    options.nextSequenceToken = data && data.nextSequenceToken;
    callback(err, options);
  });
};

CloudWatchStream.prototype._write = function (chunks, encoding, callback) {
  var complete = function (err, options) {
    if (err) {
      return callback(err);
    }

    this.nextSequenceToken = options.nextSequenceToken;
    return callback();
  };

  var options = {
    logGroupName: this.logGroupName,
    logStreamName: this.logStreamName,
    nextSequenceToken: this.nextSequenceToken,
    logEvents: map(chunks, function (c) {
      return {
        timestamp: new Date().getTime(),
        message: c.toString()
      };
    })
  };

  async.waterfall([
    this.createLogGroup.bind(this, options),
    this.createLogStream.bind(this),
    this.nextToken.bind(this),
    this.putLogEvents.bind(this)
  ], complete.bind(this));
};

util.inherits(CloudWatchStream, Writable);
module.exports = CloudWatchStream;
