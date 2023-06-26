const { getVoiceConnection } = require("@discordjs/voice");

async function pauseCommand(interaction) {
    await interaction.deferReply();

    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
        return interaction.followUp(
            "There is no active music player in this server."
        );
    }

    connection.state.subscription.player.pause();
    interaction.followUp("Paused the music.");
}

async function unpauseCommand(interaction) {
    await interaction.deferReply();

    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
        return interaction.followUp(
            "There is no active music player in this server."
        );
    }

    connection.state.subscription.player.unpause();
    interaction.followUp("Resumed the music.");
}

module.exports.pauseCommand = pauseCommand;
module.exports.unpauseCommand = unpauseCommand;
