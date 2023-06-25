const { 
    createAudioResource, 
    createAudioPlayer, 
    NoSubscriberBehavior,
    AudioPlayerStatus,
} = require('@discordjs/voice');
const musicQueue = require('../musicQueue');
  
async function musicPlayer(guildId, connection, interaction) {
    const serverQueue = musicQueue.getQueue(guildId);
  
    if (serverQueue.length === 0) {
      connection.destroy();
      return;
    }
  
    const song = serverQueue[0];
  
    if(song.stream == null){
        musicQueue.removeFromQueue(guildId);
        musicPlayer(guildId, connection);
        return;
    }

    let resource = createAudioResource(song.stream, {
        inputType: song.type
    })
  
    let player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play
        }
    })

    player.play(resource)
  
    connection.subscribe(player)
    interaction.followUp(`Added **${song.title}** to the queue.`).then(message => 
        setTimeout(() => 
            message.delete(), 
            song.duration + 10000));

    player.on(AudioPlayerStatus.Idle, async () => {
      console.log('Song ended:', song.title);
      await musicQueue.removeFromQueue(guildId)
    });

    return player;
}

module.exports.musicPlayer = musicPlayer;