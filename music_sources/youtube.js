const ytsr = require('ytsr');
const playdl = require('play-dl');

async function getStream(query) {
    try {
        const regex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&\n]+)/;
        const match = query.match(regex);
        let videoId;

        if(match == null) {
            const searchResults = await ytsr(query, { page: 1, type: 'video' });
            videoId = searchResults.items[0].id;
            // videoId = null;

            console.log(searchResults.items[0].id)

            if (videoId == null) {
                let result = await playdl.search(query, { limit: 1})
                let videoUrl = result[0].url;
                videoId = videoUrl.match(regex)[1];
            }
        } else {
            videoId = match[1];
        }

        const streamResult = await playdl.stream(`https://www.youtube.com/watch?v=${videoId}`, { quality: 2 });
        const infoResult = await ytsr(`https://www.youtube.com/watch?v=${videoId}`, { limit: 1});

        return {
            title: infoResult.items[0].title ?? 'Unknown',
            duration: infoResult.items[0].duration ?? 0,
            stream: streamResult.stream,
            type: streamResult.type
        };
    } catch (error) {
        return null;
    }
}

module.exports.getStream = getStream;