'use strict';

var platform    = require('./platform'),
	raven       = require('raven'),
	sentry, captureType;

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	sentry =  new raven.Client(options.dsn);
	captureType = options.captureType.toLowerCase();

	sentry.on('error', function(error){
		console.error('Error on Sentry.', error);
		platform.handleException(error);
	});

	platform.log('Connected to Sentry.');
	platform.notifyReady(); // Need to notify parent process that initialization of this plugin is done.

});

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {

	if (data.type) {
		if (data.type === 'message') {
			sentry.captureMessage(data.message);
		} else if (data.type === 'query') {
			sentry.captureQuery(data.message);
		} else if  (data.type === 'error' || (data.type === 'exception')) {
			sentry.captureError(data.message);
		} else
			sentry.captureError(data);
	}
	else if (captureType === 'message')
		sentry.captureMessage(data);
	else if (captureType === 'query')
		sentry.captureQuery(data);
	else
		sentry.captureError(data);

});