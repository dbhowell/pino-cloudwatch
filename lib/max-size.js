var MAX_SIZE = 1048576;
var reduce = require('lodash.reduce');

module.exports = function (chunks, nextChunk) {
  var size = reduce(chunks, function (v, c) { return v + c.length + 26; }, 0);

  return (size + nextChunk.length + 26) > MAX_SIZE;
};
