const playdl = require('play-dl');

async function getStream(query) {
    let songInformation = await playdl.soundcloud(query) // Make sure that url is track url only. For playlist, make some logic.
    let stream = await playdl.stream_from_info(songInformation, { quality: 2 });
    return {
        title: songInformation.name,
        stream: stream.stream,
        duration: songInformation.durationInSec
    }
}

module.exports.getStream = getStream;