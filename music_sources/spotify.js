const playdl = require('play-dl');

async function getStream(query) {
    const trackInfo = await playdl.spotify(query);

    let searched = await play.search(`${trackInfo.name}`, {
        limit: 1
    }) // This will search the found track on youtube.

    let stream = await play.stream(searched[0].url) // This will create stream from the above search

    return stream;
}

module.exports.getStream = getStream;