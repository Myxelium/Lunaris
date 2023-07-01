/* eslint-disable no-console */
const play = require('play-dl');

async function ReAuth() {
	play.getFreeClientID().then((clientID) => {
		play.setToken({
			soundcloud: {
				client_id: clientID,
			},
		});

		console.log(`Soundcloud Client ID: ${clientID}`);
	});

	play.authorization();
}

module.exports.ReAuth = ReAuth;