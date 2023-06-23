const { musicPlayer } = require('../utils/musicPlayer');
const { joinVoiceChannel } = require('@discordjs/voice');

async function resumeCommand(interaction) {
  await interaction.deferReply();

  const voiceChannel = interaction.member.voice.channel;

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false
  });

  let player = await musicPlayer(interaction.guild.id, connection, false);

  if (!voiceChannel) {
    return interaction.followUp('You must be in a voice channel to use this command.');
  }

  if (!player) {
    return interaction.followUp('I am not currently playing music in a voice channel.');
  }

  player.unpause();

  interaction.followUp('Resumed the music.');
}

module.exports.resumeCommand = resumeCommand;