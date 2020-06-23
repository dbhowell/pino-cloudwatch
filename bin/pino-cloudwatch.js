#!/usr/bin/env node
var yargs = require('yargs');
var pump = require('pump');
var split = require('split2');

var argv = yargs
  .usage('Sends pino logs to AWS CloudWatch Logs.\nUsage: node index.js | pino-cloudwatch [options]')
  .describe('aws_access_key_id', 'AWS Access Key ID')
  .describe('aws_secret_access_key', 'AWS Secret Access Key')
  .describe('aws_region', 'AWS Region')
  .describe('group', 'AWS CloudWatch log group name')
  .describe('prefix', 'AWS CloudWatch log stream name prefix')
  .describe('stream', 'AWS CloudWatch log stream name, overrides --prefix option')
  .describe('interval', 'The maxmimum interval (in ms) before flushing the log queue.')
  .describe('write_complete_event', 'The event that will be emitted once the logs are successfully push / save in AWS CloudWatch Logs')
  .describe('stdout', 'Copy stdin to stdout')
  .demand('group')
  .default('interval', 1000)
  .default('stdout', false)
  .argv;

module.exports = pump(process.stdin, split(), require('../index')(argv));
