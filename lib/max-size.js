// max event size is 256kb see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/cloudwatch_limits_cwl.html

const MAX_SIZE = 262144;

module.exports = function (chunks, nextChunk) {
  const size = chunks.reduce(function (v, c) { return v + c.length + 26; }, 0);

  return (size + nextChunk.length + 26) >=MAX_SIZE;
};
