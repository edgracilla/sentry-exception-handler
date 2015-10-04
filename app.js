'use strict';

var platform = require('./platform'),
	raven    = require('raven'),
	sentryClient;

/*
 * Listen for the error event.
 */
platform.on('error', function (error) {
	sentryClient.captureError(error);
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	sentryClient = new raven.Client(options.dsn);

	sentryClient.on('error', function (error) {
		console.error('Error on Sentry.', error);
		platform.handleException(new Error(error.reason));
	});

	platform.notifyReady();
});