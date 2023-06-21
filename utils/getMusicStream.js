const spotify = require('../music_sources/spotify');
const soundcloud = require('../music_sources/soundcloud');
const youtube = require('../music_sources/youtube');

const { StreamType } = require('@discordjs/voice');

async function getMusicStream(query) {
  let stream;
  let songTitle;
  let songDuration;
  let type = StreamType.Opus;

  if (query.includes('spotify.com')) {
    stream = await spotify.getStream(query);
    songTitle = stream.title;
    songDuration = stream.duration;
    stream = stream.stream;

  } else if (query.includes('soundcloud.com')) {
    stream = await soundcloud.getStream(query);
    songTitle = stream.title;
    songDuration = stream.duration;
    stream = stream.stream;
    type = StreamType.OggOpus;
    
  } else {
    stream = await youtube.getStream(query);
    songTitle = stream.title ?? 'Unknown';
    songDuration = stream.duration ?? 'Unknown';
    stream = stream.stream;
    type = StreamType.Opus;
  }

  return {
    title: songTitle,
    duration: songDuration,
    stream: stream,
    type: type
  };
}

module.exports.getMusicStream = getMusicStream;
