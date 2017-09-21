
function CloudWatchLogs (options) {

}

CloudWatchLogs.prototype.putLogEvents = function (options, callback) {
  callback();
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
