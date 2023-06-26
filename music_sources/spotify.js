const playdl = require('play-dl');
//TODO ADD SPOTIFY SUPPORT
async function getStream(query) {
    const trackInfo = await playdl.spotify(query);

    let searched = await play.search(`${trackInfo.name}`, {
        limit: 1
    })

    let stream = await play.stream(searched[0].url)
    return stream;
}

module.exports.getStream = getStream;