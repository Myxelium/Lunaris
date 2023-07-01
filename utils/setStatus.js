const { botClient } = require('../index');

async function setStatus(status) {
	await botClient.user.setActivity(status);
}

module.exports.setStatus = setStatus;
module.exports.setStatus = setStatus;