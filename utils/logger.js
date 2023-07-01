/* eslint-disable no-console */
function loggerDate() {
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

class ConsolerLogger {
	constructor() {
		this.colors = {
			info: '\x1b[36m%s\x1b[0m',
			success: '\x1b[32m%s\x1b[0m',
			warning: '\x1b[33m%s\x1b[0m',
			error: '\x1b[31m%s\x1b[0m',
			register: '\x1b[35m',
			add: '\x1b[36m',
			log: '\x1b[37m',
		};
	}

	info(...messages) {
		console.log(this.colors.info, loggerDate(), ...messages);
	}

	success(...messages) {
		console.log(this.colors.success, loggerDate(), ...messages);
	}

	warning(...messages) {
		console.log(this.colors.warning, loggerDate(), ...messages);
	}

	error(...messages) {
		console.log(this.colors.error, loggerDate(), ...messages);
	}

	register(...messages) {
		console.log(this.colors.register, loggerDate(), ...messages);
	}

	add(...messages) {
		console.log(this.colors.add, loggerDate(), ...messages);
	}

	log(...messages) {
		console.log(this.colors.log, loggerDate(), ...messages);
	}
}

module.exports = ConsolerLogger;