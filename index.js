
var emp = require('./lib')
var worker = require('./lib/worker')
var prettyjson = require('prettyjson')
var colors = require('colors/safe')

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

if (args.length > 2) {
  const code_dir = '/empirical/code'
  // Read experiment config
  var experiment_name = args[2]
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
    return emp.runExperiment(experiment)
  }).then(function () {
    logSection('SUCCESS!')
  }).catch(function (err) {
    console.log(err)
    logSection('EXPERIMENT FAILED!')
  })
} else {
  worker.consumeTasks().catch(emp.handleError)
}

