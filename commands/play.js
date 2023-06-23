const { getMusicStream } = require('./../utils/getMusicStream');
const musicQueue = require('../musicQueue');
const { musicPlayer } = require('../utils/musicPlayer');

const { 
    joinVoiceChannel, 
} = require('@discordjs/voice');

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
      
        musicPlayer(interaction.guild.id, connection);
      
        interaction.followUp(`Added ${song.title} to the queue.`);
}

module.exports.playCommand = playCommand;