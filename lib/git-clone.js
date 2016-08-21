
var Git = require('nodegit')
const shortid = require('shortid')
var fs = require('fs')
var path = require('path')

function cloneRepository (git_repo, sha, keys, code_dir) {
  var opts = {
    fetchOpts: {
      callbacks: {
        certificateCheck: function () {
          return 1
        }
      }
    }
  }
  if (keys) {
    opts.fetchOpts.callbacks.credentials = function (url, user) {
      return Git.Cred.sshKeyNew(
        user,
        keys.public_key,
        keys.private_key,
        ''
      )
    }
  }
  return Git.Clone(git_repo, code_dir, opts).then(function (repo) {
    if (sha) {
      return repo.getCommit(Git.Oid.fromString(sha)).then(function (commit) {
        return Git.Reset.reset(repo, commit, Git.Reset.TYPE.HARD).then(function () {
          return repo
        })
      })
    }
    return repo
  })
}

module.exports = function (repo, sha, keys) {
  if (!repo) return Promise.reject('Git repository URL not provided')
  // Save keys to disk as a workaround
  // FIXME: Use the from memory. Don't save to disk
  // After: https://github.com/nodegit/nodegit/pull/949
  const dir = '/tmp/'
  const rnd = shortid.generate()
  const key_files = {
    public_key: path.join(dir, `${rnd}-public_key`),
    private_key: path.join(dir, `${rnd}-private_key`)
  }
  fs.writeFileSync(key_files.public_key, keys.public_key + '\n', 'utf8') // TODO: WHYYY??
  fs.writeFileSync(key_files.private_key, keys.private_key, 'utf8')
  const codeDir = path.join(dir, rnd)
  return cloneRepository(repo, sha, key_files, codeDir)
  // Validate sha
  .then(function (repo) {
    return repo.getHeadCommit().then(function (commit) {
      if (sha !== commit.sha()) return Promise.reject('Failed getting code')
    }).then(function () {
      return codeDir
    })
  })
  // TODO: Remove the keys
}
