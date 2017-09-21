var maxSize = require('../../lib/max-size');
require('chai').should();

describe('max-size', function () {
  it('should return false when below MAX_SIZE (1048576)', function () {
    var newChunk = '1';
    var chunks = ['1', '2'];
    var result = maxSize(chunks, newChunk);

    result.should.be.false;
  });

  it('should return true when size of all chunks plus new chunk is above MAX_SIZE (1048576)', function () {
    var newChunk = '1234567890';
    var chunks = [];

    for (var i = 0; i < (1048576 / (10 + 26)) - 1; i++) {
      chunks.push('1234567890');
    }

    var result = maxSize(chunks, newChunk);

    result.should.be.true;
  });
});
