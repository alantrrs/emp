
const path = require('path')
const colors = require('colors')
const initDirs = require('./init-dirs')
const readProtocol = require('./read-protocol')
const buildImage = require('./build-image')
const cache = require('dataset-cache')
const runExperiment = require('./run-experiment')
const results = require('./results')
const getHeadCommit = require('./git-head')
const client = require('empirical-client')

module.exports = function (options, logger) {
  var experimentId
  // Get code dir
  if (!options.code_path) return Promise.reject(new Error('Error: emp run requires a code path'))
  // Make sure it's an absolute path
  options.code_path = path.resolve(process.cwd(), options.code_path)
  // Get experiment configuration
  logger.section('EXPERIMENT:')
  var experiment = readProtocol(options.code_path, options.protocol)
  if (!experiment) return Promise.reject(new Error(`Protocol "${options.protocol}" not found`))
  logger.json(experiment)
  return initDirs()
  // Create experiment on the server
  .then(function () {
    if (!options.save) return Promise.resolve()
    return getHeadCommit(options.code_path).then(function (head_sha) {
      return client.createExperiment({
        protocol: options.protocol,
        project_id: options.project,
        head_sha: head_sha
      }).then(function (experiment) {
        experimentId = experiment.id
      })
    })
  })
  // Build docker Image
  .then(function () {
    logger.section('BUILD:')
    return buildImage(experiment.environment, options.code_path, logger.write)
  })
  // Get dataset
  .then(function () {
    logger.section('DATASET:')
    if (!experiment.dataset) {
      logger.log('No dataset provided')
      return Promise.resolve()
    }
    const data = require(path.join(options.code_path, experiment.dataset))
    return cache.install(data, process.env.DATA_PATH)
    .then(function (data) {
      logger.json(data)
    })
  })
  // Run experiment
  .then(function () {
    logger.section('RUN:')
    return runExperiment(experiment, logger.write)
  })
  // Get Results
  .then(function () {
    logger.section('RESULTS:')
    return results.overall(experiment).then(function (overall) {
      logger.json({overall: overall})
      logger.log(colors.green.bold('Success'))
      return overall
    })
  }).catch(function (err) {
    logger.log(err)
    logger.log(colors.red.bold('Failed'))
    return Promise.reject(new Error(err.message))
  })
  // Save to server
  .then(function (overall) {
    if (!experimentId) return
    return client.updateExperiment(experimentId, {
      status: 'success',
      overall: overall
    })
  }, function (err) {
    if (!experimentId) return Promise.reject(err)
    return client.updateExperiment(experimentId, {
      status: 'failed',
      error: err.message
    })
  })
}

