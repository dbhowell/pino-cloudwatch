var MAX_DURATION = 24 * 60 * 60 * 1000;
var startTime = null;

module.exports = function (chunks, nextChunk) {
  if (!startTime) {
    startTime = new Date().getTime();
  }

  if (chunks.length === 0) {
    return false;
  }

  var endTime = new Date().getTime();
  var flush = (endTime - startTime) > MAX_DURATION;

  if (flush) {
    startTime = endTime;
  }

  return flush;
};
