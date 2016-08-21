
var gitClone = require('./git-clone')
var logger = require('./logger')
var client = require('empirical-client')

exports.pull = function (experiment) {
  logger.section('PULL:')
  return client.getBuild(experiment).then(function (build) {
    return client.getKeys(build.repo.full_name).then(function (keys) {
      console.log('Cloning from', build.repo.ssh_url)
      if (build.push.head_sha) console.log(`Checking out ${build.push.head_sha}`)
      return gitClone(build.repo.ssh_url, build.push.head_sha, keys)
    }).then(function (dir) {
      return {
        code_dir: dir,
        name: build.name
      }
    })
  })
}
