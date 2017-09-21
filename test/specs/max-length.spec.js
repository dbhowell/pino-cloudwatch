require('chai').should();

describe('max-length', function () {
  it('should return false when below MAX_LENGTH (10000)', function () {
    var maxLength = require('../../lib/max-length');
    var newChunk = {};
    var chunks = [];
    var result = maxLength(chunks, newChunk);

    result.should.be.false;
  });

  it('should return true when equal MAX_LENGTH (10000)', function () {
    var maxLength = require('../../lib/max-length');
    var newChunk = {};
    var chunks = [];

    for (var i = 0; i < 10000; i++) {
      chunks.push({});
    }

    var result = maxLength(chunks, newChunk);

    result.should.be.true;
  });
});
