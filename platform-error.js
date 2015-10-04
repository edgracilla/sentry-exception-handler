'use strict';

var inherits = require('util').inherits;

function PlatformError(message, stack) {
	this.name = 'PlatformError';
	this.message = message || 'An unexpected error has occurred.';
	this.stack = stack || '';
}

inherits(PlatformError, Error);

module.exports = PlatformError;