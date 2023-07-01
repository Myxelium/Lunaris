const ytsr = require('ytsr');
const playdl = require('play-dl');
const ConsolerLogger = require('../utils/logger');

const logger = new ConsolerLogger();

async function getStream(query) {
	try {
		const regex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&\n]+)/;
		const match = query.match(regex);
		let videoId;
		let usingYtsr = false;
		if (match == null) {
			const result = await playdl.search(query, { limit: 1 });
			videoId = result[0].id;

			if (videoId == null) {
				usingYtsr = true;
				const searchResults = await ytsr(query, {
					page: 1,
					type: 'video',
				});
				videoId = searchResults.items[0].id;
			}
		} else {
			// use array destructing to get the video id
			[, videoId] = match;
		}

		const streamResult = await playdl.stream(
			`https://www.youtube.com/watch?v=${videoId}`,
			{ quality: 2 },
		);
		const infoResult = usingYtsr
			? await ytsr(`https://www.youtube.com/watch?v=${videoId}`, {
				limit: 1,
			})
			: await playdl.video_info(
				`https://www.youtube.com/watch?v=${videoId}`,
			);

		logger.info('Search request', { file: 'Youtube.JS',
			Id: videoId,
			alternativeSearch: usingYtsr,
			length: usingYtsr
				? infoResult.items[0].duration
				: infoResult.video_details.durationInSec / 60,
			SearchQuery: query });

		return {
			title:
				(usingYtsr
					? infoResult.items[0].title
					: infoResult.video_details.title)
				?? 0,
			duration:
				(usingYtsr
					? infoResult.items[0].duration
					: (infoResult.video_details.durationInSec * 1000))
				?? 0,
			stream: streamResult.stream,
			type: streamResult.type,
			userInput: query,
		};
	} catch (error) {
		logger.error(error);
		return null;
	}
}

module.exports.getStream = getStream;