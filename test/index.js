/* eslint-env mocha */

var waitForIt = require('./wait-for-it')
var assert = require('assert')
var fs = require('fs')

// Test data
var builds = require('../node_modules/fixtures/builds.json')
var test_standalone = builds[4]
test_standalone.full_name = `${test_standalone.project_owner}/${test_standalone.project_name}:${test_standalone.label}`
var test_solver = builds[0]
test_solver.full_name = `${test_solver.project_owner}/${test_solver.project_name}:${test_solver.label}`
var test_evaluator = builds[3]
test_evaluator.full_name = `${test_evaluator.project_owner}/${test_evaluator.project_name}:${test_evaluator.label}`

describe('Library', function () {
  var emp = require('../lib')
  it('should clone a repo into a temp directory', function (done) {
    this.timeout(300000)
    var repo = 'git@github.com:empiricalci/hello-world.git'
    var keys = {
      public_key: fs.readFileSync('./node_modules/fixtures/test_keys/test_key.pub', 'utf8'),
      private_key: fs.readFileSync('./node_modules/fixtures/test_keys/test_key', 'utf8')
    }
    var sha = 'a574f888bdb8f286fd827263794b8aace413dcec'
    emp.getCodeDir(repo, sha, keys).then(function (codeDir) {
      assert(fs.lstatSync(codeDir).isDirectory())
      done()
    }).catch(done)
  })
  describe('readExperimentConfig', function () {
    it('should succed with valid standalone config', function () {
      var experiment = emp.readExperimentConfig('./node_modules/fixtures/standalone_project', {
        _id: '342434234',
        project_name: 'hello-world',
        project_interface: 'standalone'
      })
      assert.equal(experiment.type, 'standalone')
      assert(experiment.environment.tag)
    })
    it('should fail if a solver experiment config does not contain evaluator')
  })
  it('should get a datset')
  describe('runExperiment', function () {
    it('should run a sandalone experiment', function (done) {
      emp.runExperiment({
        _id: 'some_id',
        type: 'standalone',
        environment: {
          tag: 'empiricalci/test_standalone'
        }
      }).then(function () {
        done()
      }).catch(done)
    })
  })
  it('should cleanup code and credentials')
})

describe('Server dependant tests', function () {
  before(function (done) {
    this.timeout(30000)
    waitForIt(process.env.EMPIRICAL_API_URI, done)
  })
  describe('Client', function () {
    var client = require('../lib/client')
    it('should update a build', function (done) {
      this.timeout(5000)
      client.updateBuild({
        _id: test_solver._id,
        status: 'success'
      }).then(function () {
        done()
      }).catch(done)
    })
    it('should get a build', function (done) {
      this.timeout(5000)
      client.getBuild(test_solver.full_name).then(function (build) {
        assert.equal(test_solver.full_name, build.full_name)
        done()
      }).catch(done)
    })
    it('should project keys', function (done) {
      this.timeout(5000)
      client.getKeys(test_solver.project_owner, test_solver.project_name).then(function (res) {
        assert(res.public_key)
        assert(res.private_key)
        done()
      }).catch(done)
    })
  })

  describe('runTask', function () {
    this.timeout(30000)
    var emp = require('../lib')
    // TODO: Change auth
    it.skip('should run a standalone experiment', function (done) {
      emp.runTask(test_standalone).then(function () {
        done()
      }).catch(done)
    })
    it('should run a standalone experiment with data')
    it('should run a standalone experiment with output to workspace')
    it('should run an evaluator', function (done) {
      emp.runTask(test_evaluator).then(function () {
        done()
      }).catch(done)
    })
    it('should run a solver', function (done) {
      emp.runTask(test_solver).then(function () {
        done()
      }).catch(done)
    })
  })
})

describe('CLI', function () {
  it('should run a standalone experiment')
  it('should run a standalone experiment with data')
  it('should run a standalone experiment with output to workspace')
  it.skip('should build an evaluator')
  it.skip('should run an evaluato')
})

