const playdl = require('play-dl');
// TODO ADD SPOTIFY SUPPORT
async function getStream(query) {
	const trackInfo = await playdl.spotify(query);

	const searched = await play.search(`${trackInfo.name}`, {
		limit: 1,
	});

	const stream = await play.stream(searched[0].url);
	return stream;
}

module.exports.getStream = getStream;