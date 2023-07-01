const { getMusicStream } = require('./utils/getMusicStream');

class MusicQueue {
	constructor() {
		this.queue = new Map();
		this.looping = new Map();
	}

	addToQueue(guildId, song, front = false) {
		if (!this.queue.has(guildId)) {
			this.queue.set(guildId, []);
		}

		if (front) {
		// Add the song to the front of the queue
			this.queue.get(guildId).unshift(song);
		} else {
		// Add the song to the end of the queue
			this.queue.get(guildId).push(song);
		}
	}

	async removeFromQueue(guildId) {
		if (!this.queue.has(guildId)) {
			return;
		}

		const serverQueue = this.queue.get(guildId);

		if (this.looping.has(guildId) && this.looping.get(guildId)) {
			const song = serverQueue.shift();
			const newSong = await getMusicStream(song.userInput);
			serverQueue.push(newSong);
		} else {
			serverQueue.shift();
		}
	}

	getQueue(guildId) {
		if (!this.queue.has(guildId)) {
			return [];
		}

		return this.queue.get(guildId);
	}

	async addToQueueFirst(guildId, song) {
		if (!this.queue.has(guildId)) {
			this.queue.set(guildId, []);
		}

		this.removeFromQueue(guildId);
		this.queue.get(guildId).unshift(song);
	}

	enableLooping(guildId) {
		this.looping.set(guildId, true);
	}

	disableLooping(guildId) {
		this.looping.set(guildId, false);
	}

	clearQueue(guildId) {
		if (!this.queue.has(guildId)) {
			return;
		}

		this.queue.set(guildId, []);
	}
}

module.exports = new MusicQueue();