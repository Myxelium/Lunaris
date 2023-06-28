const playdl = require('play-dl');

async function getStream(query) {
	const songInformation = await playdl.soundcloud(query);
	const stream = await playdl.stream_from_info(songInformation, { quality: 2 });
	return {
		title: songInformation.name,
		stream: stream.stream,
		duration: songInformation.durationInSec * 1000,
		userInput: query,
	};
}

module.exports.getStream = getStream;