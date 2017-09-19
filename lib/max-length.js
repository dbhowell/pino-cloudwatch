var MAX_LENGTH = 10000;

module.exports = function (chunks, nextChunk) {
  return chunks.length === MAX_LENGTH;
};
