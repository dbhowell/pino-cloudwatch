```
# ./bin/pino-cloudwatch.js
Sends pino logs to AWS CloudWatch Logs.
Usage: node index.js | pino-cloudwatch [options]

Options:
  --help                   Show help                                   [boolean]
  --version                Show version number                         [boolean]
  --aws_access_key_id      AWS Access Key ID
  --aws_secret_access_key  AWS Secret Access Key
  --aws_region             AWS Region
  --group                  AWS CloudWatch log group name              [required]
  --prefix                 AWS CloudWatch log stream name prefix
  --interval               The maxmimum interval (in ms) before flushing the log
                           queue.                                [default: 1000]
```