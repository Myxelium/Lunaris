const { getMusicStream } = require('./utils/getMusicStream');

class MusicQueue {
  constructor() {
    this.queue = new Map();
    this.looping = new Map();
  }

  addToQueue(guildId, song) {
    if (!this.queue.has(guildId)) {
      this.queue.set(guildId, []);
    }

    this.queue.get(guildId).push(song);
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