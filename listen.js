
var Pusher = require('pusher-js/node')
var config = require('./config')
var emp = require('./lib')
var debug = require('debug')('emp')

var auth = new Buffer(`${config.client.key}:${config.client.secret}`).toString('base64')
var headers = {
  'Authorization': 'Basic ' + auth
}

var pusher = new Pusher(config.pusher.key, {
  authEndpoint: config.pusher.auth_endpoint,
  auth: {
    headers: headers
  }
})

pusher.connection.bind('error', function (err) {
  console.log('Connection error:', err)
  process.exit(1)
})

function subscribeTo (channel_name) {
  return new Promise(function (resolve, reject) {
    var channel = pusher.subscribe(channel_name)
    channel.bind('pusher:subscription_succeeded', function () {
      resolve(channel)
    })
    channel.bind('pusher:subscription_error', function (status) {
      reject(new Error(status))
    })
  })
}

// TODO: Replace with log-pusher
function logger (channel) {
  return function (str) {
    channel.trigger('client-log', str)
  }
}

// Consume
function consume () {
  var task = queue.shift()
  if (task) {
    debug('Running task: %o', task)
    const logs_channel = `private-${task.full_name.replace(/\//g, '-')}@logs`
    return subscribeTo(logs_channel)
    .then(function (channel) {
      return emp.runTask(task, logger(channel)).then(function () {
        console.log('SUCCESS')
        consume()
      }).catch(function (err) {
        console.log('ERROR: ', err.message)
        consume()
      })
    })
  } else {
    setTimeout(consume, 1000)
  }
}

// Queue
var queue = []
const tasks_channel = `private-${config.client.key}@tasks`
subscribeTo(tasks_channel).then(function (channel) {
  console.log('EMP is listening for tasks on channel:', tasks_channel)
  channel.bind('new-task', function (task) {
    debug('Received task: %o', task)
    queue.push(task)
  })
  consume()
}).catch(function (err) {
  console.log(err)
})
