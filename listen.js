
var config = require('./config')
var emp = require('./lib')
var debug = require('debug')('emp')
var PubNub = require('pubnub')
var fetch = require('node-fetch')

var pubnub

// Logger
function logger (channel) {
  return function (log) {
    pubnub.publish({
      channel: channel,
      message: log
    })
  }
}

// Auth
const auth = new Buffer(`${config.client.key}:${config.client.secret}`).toString('base64')
function authPubNub (channel) {
  return fetch(`${config.client.root}/api/auth/${channel}`, {
    headers: {
      'Authorization': 'Basic ' + auth
    }
  }).then(function (response) {
    if (!response.ok) return Promise.reject(response.status)
    return response.json()
  })
}

// Consume
function consume () {
  var task = queue.shift()
  if (task) {
    debug('Running task: %o', task)
    const logs_channel = `${task.full_name}/logs`
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
function listen () {
  const tasks_channel = `${config.client.key}/tasks`
  authPubNub(tasks_channel).then(function (data) {
    // Init pubnub
    pubnub = PubNub.init(data)
    // Listen
    pubnub.subscribe({
      channel: tasks_channel,
      message: function (task) {
        debug('Received task: %o', task)
        queue.push(task)
      },
      connect: function (channel) {
        console.log('EMP is listening on channel', channel)
        // Start consuming
        consume()
      }
    })
  }).catch(function (err) {
    console.log(err)
  })
}

listen()
