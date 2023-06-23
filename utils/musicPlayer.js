const { 
    createAudioResource, 
    createAudioPlayer, 
    NoSubscriberBehavior,
    AudioPlayerStatus,
} = require('@discordjs/voice');
const musicQueue = require('../musicQueue');
  
async function musicPlayer(guildId, connection) {
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
  
    player.on(AudioPlayerStatus.Idle, () => {
      console.log('Song ended:', song.title);
      musicQueue.removeFromQueue(guildId);
      musicPlayer(guildId, connection);
    });

    return player;
  }

// TODO: USE THIS AGAIN
function convertToMilliseconds(songLenth) {
    try {
        let time = songLenth.split(':')
        let milliseconds = 0;
        if(time.length == 3) {
            milliseconds = (parseInt(time[0]) * 60 * 60 * 1000) + (parseInt(time[1]) * 60 * 1000) + (parseInt(time[2]) * 1000)
        } else if(time.length == 2) {
            milliseconds = (parseInt(time[0]) * 60 * 1000) + (parseInt(time[1]) * 1000)
        } else if(time.length == 1) {
            milliseconds = (parseInt(time[0]) * 1000)
        }
        return milliseconds   
    } catch (error) {
        return 10000;
    }
}

module.exports.musicPlayer = musicPlayer;