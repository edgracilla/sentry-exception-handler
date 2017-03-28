'use strict'

const reekoh = require('reekoh')
const plugin = new reekoh.plugins.ExceptionLogger()

let sentryClient = null

plugin.on('exception', (error) => {
  sentryClient.captureException(error)

  plugin.log(JSON.stringify({
    title: 'Exception sent to Sentry',
    data: {message: error.message, stack: error.stack, name: error.name}
  }))
})

plugin.once('ready', () => {
  let raven = require('raven')

  sentryClient = new raven.Client(plugin.config.dsn)

  sentryClient.on('error', (error) => {
    console.error('Error on Sentry.', error)
    plugin.logException(new Error(error.reason))
  })

  plugin.log('Sentry Exception Logger has been initialized.')
  plugin.emit('init')
})

module.exports = plugin
