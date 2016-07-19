
const cache = require('dataset-cache')
const prettyjson = require('prettyjson')
const config = require('../config')

function get (url) {
  return cache.get(url, config.data_dir).then(function (data){
    console.log(data)
  })
}

function hash (path) {
  return cache.hash(path).then(function (hash) {
    console.log(`${path.replace('/x','')}\t${hash}`)
  })
}

module.exports = function (subcommand) {
  switch (subcommand) {
    case 'get':
      return get(process.argv[3])
    case 'hash':
      return hash(process.env.DATA_FILE)
    default:
      console.log('Usage: emp data subcommand [args]')
  }
}

