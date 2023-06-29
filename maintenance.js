const { exec } = require('child_process');
const schedule = require('node-schedule');

const repoUrl = 'https://github.com/Myxelium/Lunaris/';
const localRepoPath = '/home/pi/Lunaris/';
const processName = 'index.js';

schedule.scheduleJob('0 1 * * *', () => {
    exec(`cd ${localRepoPath} && git fetch`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        exec(`cd ${localRepoPath} && git rev-list HEAD...origin/master --count`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            if (parseInt(stdout) > 0) {
                exec(`pm2 stop ${processName}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    exec(`cd ${localRepoPath} && git pull`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        const now = new Date();
                        console.log(`Repository updated at ${now.toLocaleString()}`);
                        exec(`pm2 start ${processName}`, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec error: ${error}`);
                                return;
                            }
                            console.log(`${processName} started`);
                        });
                    });
                });
            }
        });
    });
});
