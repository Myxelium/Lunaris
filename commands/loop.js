const musicQueue = require('../musicQueue');

async function loopCommand(interaction) {
  await interaction.deferReply();

  const looping = interaction.options.getBoolean('looping');

  musicQueue.setLooping(interaction.guild.id, looping);

  if (looping) {
    interaction.followUp('Enabled looping for the current queue.');
  } else {
    interaction.followUp('Disabled looping for the current queue.');
  }
}

module.exports.loopCommand = loopCommand;