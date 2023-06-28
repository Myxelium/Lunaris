const play = require('play-dl');

async function ReAuth() {
	play.getFreeClientID().then((clientID) => {
		play.setToken({
			soundcloud: {
				client_id: clientID,
			},
		});

		console.log(`Soudncloud Client ID: ${clientID}`);
	});

	play.authorization();
}

module.exports.ReAuth = ReAuth;
