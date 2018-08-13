# pino-cloudwatch

#### Send pino logs to AWS CloudWatch Logs.

## About

`pino-cloudwatch` is a simple pino transport that buffers and holds pino logs until one of the following conditions are met:
  * the number of logs reaches 10,000
  * the 'size' of the logs reaches 1,048,576 bytes OR
  * there is at least 1 log buffered and 1,000ms (default) has passed without another log item being buffered
This is to minimise the number of calls to CloudWatch Logs.

The log group name is specified via the CLI (`--prefix`) and the log stream name is built based on the following information:
  * An optional `prefix`,
  * the hostname (via `os.hostname()`),
  * the process ID (via `process.id`),
  * the epoch when the first log are sent to CloudWatch Logs

## Usage
```
# ./bin/pino-cloudwatch.js
Sends pino logs to AWS CloudWatch Logs.
Usage: node index.js | pino-cloudwatch [options]

Options:
  --help                   Show help                                   [boolean]
  --version                Show version number                         [boolean]
  --aws_creds_json         Load credentials via JSON document. 
                           Path to AWS JSON config.
  --aws_creds_profile      Load credentials via shared ini file. 
                           Profile name found in ~/.aws/credentials
  --aws_access_key_id      AWS Access Key ID
  --aws_secret_access_key  AWS Secret Access Key
  --aws_region             AWS Region
  --group                  AWS CloudWatch log group name              [required]
  --prefix                 AWS CloudWatch log stream name prefix
  --interval               The maxmimum interval (in ms) before flushing the log
                           queue.                                   [default: 1000]
```
## Options

### `group`: `String` (required)

### `prefix`: `String`

### `interval`: `Integer` (default `1000`ms, `0` to disable)

The `interval` is the amount of time in ms that must elapse before attempting to send logs to CloudWatch Logs. Increase this to reduce the number of calls to CloudWatch Logs.

If you set this to `0` then it will only send logs when:
  * It reaches the maxiumum number of logs
  * It reaches the maximum size of the logs

__note__: Disabling the interval could mean that logs will *never* be sent to CloudWatch Logs.

### `aws_access_key_id`: `String`

### `aws_secret_access_key`: `String`

### `aws_region`: `String`

## Other uses

### Writable Stream

This module can be required and used as a writable stream:
```javascript
var pinoCloudWatch = require('pino-cloudwatch');
var split = require('split2');
var pump = require('pump');

pump(process.stdin, split(), pinoCloudWatch({ group: 'test' }));
```

### Arbitrary logs

Technically `pino-cloudwatch` can send any object mode stream to CloudWatch Logs. This includes *any* text-based log file. For example: tailing a standard log file like nginx access.log.

## Test
```
# npm test
```