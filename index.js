// Copyright 2022 Anthony Mugendi
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// process.env.DEBUG = 'kill-to-listen';

const net = require('net'),
	{ kill } = require('cross-port-killer'),
	debug = require('debug-symbols')('kill-to-listen');

async function kill_to_listen(app, port) {
	try {
		// verify port
		port = parseInt(port);
		if (isNaN(port)) {
			throw new Error(`${port} is not a valid port number`);
		}

		// try to kill port if busy repeatedly
		let killAttempts = 0;

		while ((await port_busy(port)) && killAttempts < 50) {
			debug.info(
				`Port ${port} is${
					killAttempts ? ' still ' : ' '
				}busy. Attempting to kill...`
			);

			await kill(3000, 'tcp');
			await delay(500);
			// increment killAttempts so as not to loop forever
			killAttempts++;
		}

		// listen now
		app.listen(port);
        
	} catch (error) {
		throw error;
	}
}

function port_busy(port) {
	return new Promise((resolve) => {
		const tester = net
			.createServer()
			// catch errors, and resolve false
			.once('error', (err) => {
				resolve(true);
			})
			// return true if succeed
			.once('listening', () =>
				tester.once('close', () => resolve(false)).close()
			)
			.listen(port);
	});
}

function delay(ms = 1000) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

module.exports = kill_to_listen;
