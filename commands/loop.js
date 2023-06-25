const musicQueue = require('../musicQueue');

async function enableLooping(interaction) {
    await interaction.deferReply();
    const guildId = interaction.guild.id;
    musicQueue.enableLooping(guildId);
    interaction.followUp('Enabled looping for the current queue.');
}

async function unloopCommand(interaction) {
    await interaction.deferReply();
    const guildId = interaction.guild.id;
    musicQueue.disableLooping(guildId);
    interaction.followUp('Disabled looping for the current queue.');
}

async function toggleLoopCommand(interaction) {
  await interaction.deferReply();
  const guildId = interaction.guild.id;
  if (musicQueue.looping.has(guildId) && musicQueue.looping.get(guildId)) {
      musicQueue.disableLooping(guildId, false);
      interaction.followUp('Disabled looping for the current queue.');
  } else {
      musicQueue.enableLooping(guildId, true);
      interaction.followUp('Enabled looping for the current queue.');
  }
}

module.exports.toggleLoopCommand = toggleLoopCommand;

module.exports.unloopCommand = unloopCommand;
module.exports.enableLooping = enableLooping;