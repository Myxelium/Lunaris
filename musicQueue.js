class MusicQueue {
    constructor() {
      this.queue = new Map();
    }
  
    getQueue(guildId) {
      if (!this.queue.has(guildId)) {
        this.queue.set(guildId, []);
      }
      return this.queue.get(guildId);
    }
  
    addToQueue(guildId, song) {
      const serverQueue = this.getQueue(guildId);
      serverQueue.push(song);
    }
  
    removeFromQueue(guildId) {
      const serverQueue = this.getQueue(guildId);
      serverQueue.shift();
    }
  }
  
  module.exports = new MusicQueue();