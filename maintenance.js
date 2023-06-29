Sure, here is an updated version of the script that will log the date and time when the repository was updated:

const { exec } = require('child_process');
const schedule = require('node-schedule');

const repoUrl = 'https://github.com/Myxelium/Lunaris/';
const localRepoPath = '/home/pi/Lunaris/';

schedule.scheduleJob('0 1 * * *', () => {
    exec(`cd ${localRepoPath} && git fetch`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stdout.includes('[new branch]')) {
            exec('pm2 stop Lunaris', (error, stdout, stderr) => {
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
                    exec('pm2 start Lunaris', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        console.log('Lunaris started');
                    });
                });
            });
        }
    });
});
