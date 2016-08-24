
const gitClone = require('./git-clone')
const client = require('empirical-client')
const shortid = require('shortid')
const debug = require('debug')('emp')

// Returns code_path and head_sha

module.exports = function (options) {
  // Use temp path if none is given
  var code_path = options.code_path || `/tmp/${options.project.split('/').pop()}-${shortid.generate()}`
  debug('pulling to : %s', code_path)
  return client.getAuthToken().then(function (token) {
    const https_url = `https://github.com/${options.project}.git`
    return gitClone(
      https_url,
      code_path,
      token,
      options.head_sha
    )
  }).then(function () {
    return {
      code_path: code_path,
      head_sha: options.head_sha
    }
  })
}
