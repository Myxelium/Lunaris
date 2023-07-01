// leaveCommand.js
const { getVoiceConnection } = require('@discordjs/voice');
const { intervalMap } = require('../utils/nowPlayingMessage'); // Import the intervalMap from the nowPlayingMessage module
const ConsolerLogger = require('../utils/logger');

const logger = new ConsolerLogger();
async function leaveCommand(interaction) {
	await interaction.deferReply();

	try {
		const guildId = interaction.guild.id;
		const connection = getVoiceConnection(guildId);

		if (!connection) {
			return interaction.followUp('I am not currently in a voice channel.');
		}

		// Clear the interval for updating the progress bar
		const interval = intervalMap.get(guildId);
		clearInterval(interval);

		connection.destroy();
		return interaction.followUp('I have left the voice channel.');
	} catch (error) {
		logger.error(error);
		return interaction.followUp('An error occurred while trying to leave the voice channel.');
	}
}

module.exports.leaveCommand = leaveCommand;