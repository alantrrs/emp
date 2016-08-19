/* eslint-env mocha */

const assert = require('assert')
const path = require('path')
const spawn = require('child_process').spawn
const Docker = require('dockerode')
const docker = new Docker()
const env = require('node-env-file')
const fs = require('fs')
const setup = require('./setup')

const ENV_FILE = `${process.env.HOME}/.emp/emp.env`

function getContainer (image, cmd, cb) {
  docker.listContainers(function (err, containers) {
    if (err) console.log(err)
    var emp_info = containers.find(function (info) {
      return (info.Image === image && info.Command === cmd)
    })
    cb(emp_info)
  })
}

function testMount (container, hostPath, mode) {
  var vol = container.Mounts.find(function (volume) {
    return (volume.Source === path.resolve(process.cwd(), hostPath))
  })
  assert(vol)
  assert.equal(vol.Source, vol.Destination)
  assert.equal(vol.Mode, mode || '')
  if (mode === 'ro') {
    assert(!vol.RW)
  } else {
    assert(vol.RW)
  }
}

before(function (done) {
  process.env.EMPIRICAL_HOST = 'http://localhost:1337'
  setup.backupConfig(ENV_FILE, done)
})

describe('./bin/run.sh', function () {
  describe('run ARGS', function () {
    this.timeout(20000)
    const code_path = './node_modules/fixtures/standalone_project'
    var container
    it('runs and exits successfully', function (done) {
      const emp = spawn('./bin/run.sh', ['run', 'hello-world', code_path])
      emp.stdout.once('data', function (data) {
        env(ENV_FILE)
        getContainer('empiricalci/emp:test', `node index.js run hello-world ${code_path}`, function (info) {
          container = info
        })
      })
      emp.on('close', function (code) {
        if (code) return done(new Error('Failed'))
        done()
      })
    })
    it('mounts code directory as read-only', function () {
      testMount(container, code_path, 'ro')
    })
    // Common tests
    it('mounts environment config file', function () {
      testMount(container, ENV_FILE)
    })
    it('mounts the docker socket', function () {
      testMount(container, '/var/run/docker.sock')
    })
    it('mounts the workspaces directory', function () {
      testMount(container, `${process.env.EMPIRICAL_DIR}/workspaces`)
    })
    it('mounts the data directory', function () {
      testMount(container, `${process.env.EMPIRICAL_DIR}/data`)
    })
    it('passes $HOME')
  })
  const test_hash = '986915f2caa2c8f9538f0b77832adc8abf3357681d4de5ee93a202ebf19bd8b8'
  describe('data get URL', function () {
    this.timeout(20000)
    const test_url = 'https://raw.githubusercontent.com/empiricalci/fixtures/data.csv'
    var container
    it('runs and exits successfully', function (done) {
      const emp2 = spawn('./bin/run.sh', ['data', 'get', test_url])
      emp2.stdout.once('data', function (data) {
        getContainer('empiricalci/emp:test', `node index.js data get ${test_url}`, function (info) {
          container = info
        })
      })
      emp2.on('close', function (code) {
        if (code) return done(new Error('Failed'))
        done()
      })
    })
    it('downloads the data successfully', function () {
      assert(fs.lstatSync(`${process.env.EMPIRICAL_DIR}/data/${test_hash}`).isFile())
    })
    // Common tests
    it('mounts environment config file', function () {
      testMount(container, ENV_FILE)
    })
    it('mounts the docker socket', function () {
      testMount(container, '/var/run/docker.sock')
    })
    it('mounts the workspaces directory', function () {
      testMount(container, `${process.env.EMPIRICAL_DIR}/workspaces`)
    })
    it('mounts the data directory', function () {
      testMount(container, `${process.env.EMPIRICAL_DIR}/data`)
    })
    it('passes $HOME')
  })
  describe('data hash FILE', function () {
    this.timeout(20000)
    var test_file
    var container
    it('runs and exits successfully', function (done) {
      test_file = `${process.env.EMPIRICAL_DIR}/data/${test_hash}`
      const abs_path = path.resolve(process.cwd(), test_file)
      const emp3 = spawn('./bin/run.sh', ['data', 'hash', test_file])
      emp3.stdout.once('data', function (data) {
        getContainer('empiricalci/emp:test', `node index.js data hash ${abs_path}`, function (info) {
          container = info
        })
      })
      emp3.on('close', function (code) {
        if (code) return done(new Error('Failed'))
        done()
      })
    })
    it('mounts the data file', function () {
      testMount(container, test_file)
    })
    // Common tests
    it('mounts environment config file', function () {
      testMount(container, ENV_FILE)
    })
    it('mounts the docker socket', function () {
      testMount(container, '/var/run/docker.sock')
    })
    it('mounts the workspaces directory', function () {
      testMount(container, `${process.env.EMPIRICAL_DIR}/workspaces`)
    })
    it('mounts the data directory', function () {
      testMount(container, `${process.env.EMPIRICAL_DIR}/data`)
    })
    it('passes $HOME')
  })
})

after(function (done) {
  setup.resetConfig(ENV_FILE, done)
})
