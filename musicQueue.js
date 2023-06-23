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

  removeFromQueue(guildId) {
    if (!this.queue.has(guildId)) {
      return;
    }

    const serverQueue = this.queue.get(guildId);

    if (this.looping.has(guildId) && this.looping.get(guildId)) {
      serverQueue.push(serverQueue.shift());
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

  setLooping(guildId, looping) {
    this.looping.set(guildId, looping);
  }
}

module.exports = new MusicQueue();