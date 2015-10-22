'use strict';

var platform = require('./platform'),
	sentryClient;

/*
 * Listen for the error event.
 */
platform.on('error', function (error) {
	sentryClient.captureError(error);
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	platform.notifyClose();
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	var raven = require('raven');

	sentryClient = new raven.Client(options.dsn);

	sentryClient.on('error', function (error) {
		console.error('Error on Sentry.', error);
		platform.handleException(new Error(error.reason));
	});

	platform.log('Sentry Exception Handler Initialized.')
	platform.notifyReady();
});