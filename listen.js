
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

var PubNub = require('pubnub')

var pubnub = PubNub.init({
  publish_key: 'pub-c-813b2f6d-059e-42b4-a939-cc465c6c9bba',
  subscribe_key: 'sub-c-ed11a4da-3447-11e6-9edb-02ee2ddab7fe',
  auth_key: config.client.secret
})

function logger (channel) {
  return function (log) {
    pubnub.publish({
      channel: 'my_channel',
      message: log
    })
  }
}

// Auth
var fetch = require('node-fetch')
function authPubNub(channel) {
  return fetch(`${config.client.root}/api/pubnub/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + auth
    },
    body: JSON.stringify({channel: channel})
  }).then(function (response) {
    if (!response.ok) return Promise.reject(response.status)
    return Promise.resolve()
  })
}

// Consume
function consume () {
  var task = queue.shift()
  if (task) {
    debug('Running task: %o', task)
    const logs_channel = `${task.full_name}-logs`
    return authPubNub(logs_channel).then(function () {
      return emp.runTask(task, logger(logs_channel)).then(function () {
        console.log('SUCCESS')
        consume()
      })
    }).catch(function (err) {
      console.log('ERROR: ', err.message)
      consume()
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
