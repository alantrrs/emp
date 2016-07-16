/* eslint-env mocha */

const spawn = require('child_process').spawn
const assert = require('assert')
// const debug = require('debug')('emp')

describe('emp configure', function () {
  const emp = spawn('./bin/run.sh', ['configure'])
  emp.stderr.on('data', function (err) {
    console.log(err.toString())
  })
  it('prompts to change the default empirical directory', function (done) {
    this.timeout(30000)
    function handler (data) {
      assert.equal(data.toString(), `Empirical directory [${process.env.HOME}/empirical]: `)
      emp.stdout.removeListener('data', handler)
      done()
    }
    emp.stdout.once('data', handler)
  })
  it('receives the new empirical directory from stdin', function (done) {
    this.timeout(30000)
    emp.stdin.write('/tmp/emp\n')
    function handler (data) {
      assert.equal(data.toString(), 'Saved new empirical directory: /tmp/emp\n')
      done()
    }
    emp.stdout.once('data', handler)
  })
  it('Fails if passed a non-absolute directory')
})

// TODO: Test install script
