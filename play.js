const { 
    joinVoiceChannel, 
    createAudioResource, 
    createAudioPlayer, 
    NoSubscriberBehavior,
    AudioPlayerStatus,
} = require('@discordjs/voice');
const musicQueue = require('./musicQueue');
const { getMusicStream } = require('./utils/getMusicStream');

async function playCommand(interaction) {
    await interaction.deferReply();
  
    const query = interaction.options.getString('input');
    const voiceChannel = interaction.member.voice.channel;
  
    if (!voiceChannel) {
      return interaction.followUp('You must be in a voice channel to use this command.');
    }
    const song = await getMusicStream(query);
    
    musicQueue.addToQueue(interaction.guild.id, song);
  
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false
    });
  
    playSong(interaction.guild.id, connection);
  
    interaction.followUp(`Added ${song.title} to the queue.`);
  }
  
  async function playSong(guildId, connection) {
    const serverQueue = musicQueue.getQueue(guildId);
  
    if (serverQueue.length === 0) {
      connection.destroy();
      return;
    }
  
    const song = serverQueue[0];
  
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
      playSong(guildId, connection);
    });
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

module.exports.playCommand = playCommand;