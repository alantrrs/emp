
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

exports.addLogFile = function (logfile) {
  logger.add(winston.transports.File, {
    filename: logfile,
    showLevel: false,
    timestamp: false,
    json: false
  })
}

exports.section = function (title) {
  logger.info(colors.white.bold(title))
}

exports.write = function (text) {
  logger.info(text.replace(/$(\r\n|\n|\r)/gm, ''))
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

exports.logPromise = function (log) {
  return new Promise(function (resolve, reject) {
    logger.info(log, function (err, level, msg, meta) {
      if (err) return reject(err)
      // FIXME: Hack to work around winston's bug. See:
      // https://github.com/winstonjs/winston/issues/228#issuecomment-114063636
      var numFlushes = 0
      var numFlushed = 0
      Object.keys(logger.transports).forEach(function (k) {
        if (logger.transports[k]._stream) {
          numFlushes += 1
          logger.transports[k]._stream.once('finish', function () {
            numFlushed += 1
            if (numFlushes === numFlushed) {
              resolve()
            }
          })
          logger.transports[k]._stream.end()
        }
      })
      if (numFlushes === 0) {
        resolve()
      }
    })
  })
}

