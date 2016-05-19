
var emp = require('./lib')
var worker = require('./lib/worker')

// TODO: Print help
// if emp [ params ] [ directory | git url ]
// if directory is empty then emp is run as a worker and will connect to empirical.com to wait for tasks
// emp .
// emp git@github:alantrrs/emp
// emp --configure to configure

// TODO: Check if it's configured
// Configure
// - data path
// - ssh credentials
// - tmp sessions path

var args = process.argv

if (args.length > 2) {
  console.log(args)
  var experiment_name = args[2]
  // TODO: Copy code directory
  // TODO: Read experiment config
  // TODO: Build docker Image
  // TODO: Get dataset
  // TODO: Run experiment
} else {
  worker.consumeTasks().catch(emp.handleError)
}

