/* eslint-disable no-shadow */
const { exec } = require('child_process');
const schedule = require('node-schedule');
const ConsolerLogger = require('./utils/logger');

const localRepoPath = '/home/pi/Lunaris/';
const processName = 'index.js';

const logger = new ConsolerLogger();

schedule.scheduleJob('0 1 * * *', () => {
	exec(`cd ${localRepoPath} && git fetch`, (error) => {
		if (error) {
			logger.error(`exec error: ${error}`);
			return;
		}
		exec(`cd ${localRepoPath} && git rev-list HEAD...origin/master --count`, (error, stdout) => {
			if (error) {
				logger.error(`exec error: ${error}`);
				return;
			}
			if (parseInt(stdout, 10) > 0) {
				exec(`pm2 stop ${processName}`, (error) => {
					if (error) {
						logger.error(`exec error: ${error}`);
						return;
					}
					exec(`cd ${localRepoPath} && git pull`, (error) => {
						if (error) {
							logger.error(`exec error: ${error}`);
							return;
						}
						const now = new Date();
						logger.log(`Repository updated at ${now.toLocaleString()}`);
						exec(`pm2 start ${processName}`, (error) => {
							if (error) {
								logger.error(`exec error: ${error}`);
								return;
							}
							logger.log(`${processName} started`);
						});
					});
				});
			}
		});
	});
});