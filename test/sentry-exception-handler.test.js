'use strict';

const DSN = 'https://79b79ae484fe419da770922d8f4cb3e1:2d4b8fe77ae449389f8f960e589128e7@app.getsentry.com/54044';

var cp     = require('child_process'),
	should = require('should'),
	exceptionHandler;

describe('Exception Handler', function () {
	this.slow(8000);

	after('terminate child process', function () {
		this.timeout(5000);

		setTimeout(function () {
			exceptionHandler.kill('SIGKILL');
		}, 4000);
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			should.ok(exceptionHandler = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 8 seconds', function (done) {
			this.timeout(8000);

			exceptionHandler.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			exceptionHandler.send({
				type: 'ready',
				data: {
					options: {
						dsn: DSN
					}
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});

	describe('#error', function (done) {
		it('should process the error data', function () {
			var sampleError = new Error('This is a sample error.');

			exceptionHandler.send({
				type: 'error',
				data: {
					message: sampleError.message,
					stack: sampleError.stack
				}
			}, done);
		});
	});
});