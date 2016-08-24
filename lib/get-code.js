
const getHeadCommit = require('./git-head')
const pull = require('./pull')

// Returns code_path and head_sha

module.exports = function (options) {
  if (!options.head_sha) {
    if (!options.code_path) return Promise.reject(new Error('Error: emp run requires a code path'))
    // Get the head_sha from the given code_path
    return getHeadCommit(options.code_path).then(function (head_sha) {
      // Get code
      return pull({
        project: options.project,
        head_sha: head_sha
      })
    })
  } else {
    return pull({
      project: options.project,
      head_sha: options.head_sha
    })
  }
}
