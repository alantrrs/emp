
var prettyjson = require('prettyjson')
var colors = require('colors/safe')
var winston = require('winston')

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      showLevel: false
    })
  ]
})

// configure file logger
logger.add(winston.transports.File, {
  filename: 'some-log.log',
  showLevel: false,
  timestamp: false,
  json: false
})

exports.section = function (title) {
  logger.info(colors.white.bold(title))
}

exports.write = function (text) {
  process.stdout.write(text)
}

exports.json = function (json) {
  logger.info(prettyjson.render(json))
}

exports.error = function (err) {
  logger.info(colors.red.bold(err))
}

exports.log = function (log) {
  logger.info(log)
}
