
var emp = require('./lib')
var prettyjson = require('prettyjson')
var colors = require('colors/safe')
var listen = require('./listen')
var fetch = require('node-fetch')

// TODO: Print help
// if emp [ params ] [ directory  ]
// emp .

// TODO: Check if it's configured
// Configure
// - data path
// - ssh credentials
// - tmp sessions path

var args = process.argv

function logSection (section) {
  console.log(colors.white.bold(section))
}

function logHandler (line) {
  process.stdout.write(line)
}

function run (experiment_name) {
  const code_dir = '/empirical/code'
  // Read experiment config
  logSection('EXPERIMENT:')
  var experiment = emp.readExperimentConfig(code_dir, {
    name: experiment_name
  })
  console.log(prettyjson.render(experiment))
  // Build docker Image
  logSection('BUILD:')
  emp.buildImage(experiment.environment, code_dir, function (data) {
    process.stdout.write(data)
  })
  // Get dataset
  .then(function () {
    logSection('DATASET:')
    return emp.getDataset(code_dir, experiment.dataset).then(function (data) {
      if (!data) console.log('No dataset provided')
      console.log(prettyjson.render(data))
    })
  })
  // Run experiment
  .then(function () {
    logSection('RUN:')
    return emp.runExperiment(experiment, logHandler)
  }).then(function () {
    logSection('RESULTS:')
    return emp.getResults(experiment).then(function (overall) {
      console.log(prettyjson.render({overall: overall}))
      console.log(colors.green.bold('Success'))
    })
  }).catch(function (err) {
    console.log(err)
    console.log(colors.red.bold('Failed'))
  })
}

function pull (url) {
  var host = process.env.EMPIRICAL_API_URI || 'http://empiricalci.com'
  fetch(`${host}/api/x/${url}`).then(function (res) {
    return res.json()
  }).then(function (json) {
      console.log(json)
      emp.runTask(json, logHandler).then(function () {
        console.log(colors.green.bold('Success'))
      }, function (err) {
        console.log(err)
        console.log(colors.red.bold('Failed'))
      })
  }, function (err) {
    console.log(err)
  })
}

switch (args[2]) {
  case 'listen':
    listen()
    break
  case 'run':
    run(args[3])
    break
  case 'pull':
    pull(args[3])
    break
  default:
    console.log('Command not found')
}

