var MAX_SIZE = 1048576;

module.exports = function (chunks, nextChunk) {
  return ((chunks.length + 1) * 26 > MAX_SIZE);
};
