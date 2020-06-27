const invalidSequenceTokenError = {
  code: 'InvalidSequenceTokenException'
};

const invalidSequenceTokenRequest = {
  httpResponse: {
    body: '{"expectedSequenceToken": 1000}'
  }
};

function CloudWatchLogs (options) {
  this.mode = options.region;
}

CloudWatchLogs.prototype.putLogEvents = function (options, callback) {
  if (this.mode === 'InvalidSequenceTokenException' && options.sequenceToken === 1) {
    var cb = callback.bind(invalidSequenceTokenRequest);

    return cb(invalidSequenceTokenError, null);
  }

  callback(null, { nextSequenceToken: options.sequenceToken++ });
};

CloudWatchLogs.prototype.createLogGroup = function (options, callback) {
  callback();
};

CloudWatchLogs.prototype.createLogStream = function (options, callback) {
  callback();
};

CloudWatchLogs.prototype.describeLogStreams = function (options, callback) {
  var data = {
    logStreams: [
      {
        name: 'test',
        uploadSequenceToken: 1
      }
    ]
  };

  callback(null, data);
};

module.exports = CloudWatchLogs;
