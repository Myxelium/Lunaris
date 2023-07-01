/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
// const playdl = require('play-dl');
// const youtube = require('./youtube');

const playdl = require('play-dl');
const youtube = require('./youtube');
const musicQueue = require('../musicQueue'); // Import the musicQueue module

async function getStream(query, guildId) {
	// Check if the query is a Spotify playlist
	if (playdl.sp_validate(query) === 'playlist') {
		let firstTrack = {};
		// Get the playlist information
		const playlistInfo = await playdl.spotify(query);

		// Loop through the tracks in the playlist
		// Get the tracks from the fetched_tracks Map
		const tracks = playlistInfo.fetched_tracks.get('1');

		// Loop through the tracks in the playlist
		for (const track of tracks) {
			// save the first track in the queue
			if (tracks.indexOf(track) === 0) {
				firstTrack = await youtube.getStream(`${track.name} ${track.artists[0].name}`);
			} else {
			// Get a stream for the track using the youtube module
				const song = await youtube.getStream(`${track.name} ${track.artists[0].name}`);

				// Add the song to the music queue
				musicQueue.addToQueue(guildId, song);
			}
		}

		// Return null to indicate that a playlist was queued
		return firstTrack;
	}

	// Handle single tracks as before
	const trackInfo = await playdl.spotify(query);
	return youtube.getStream(`${trackInfo.name} ${trackInfo.artists[0].name}`);
}

module.exports.getStream = getStream;