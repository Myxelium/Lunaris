const { getVoiceConnection } = require('@discordjs/voice');
const musicQueue = require('../musicQueue');

async function stopCommand(interaction) {
	await interaction.deferReply();

	const voiceChannel = interaction.member.voice.channel;
	const connection = getVoiceConnection(interaction.guild.id);

	if (!voiceChannel) {
		return interaction.followUp(
			'You must be in a voice channel to use this command.',
		);
	}

	const guildId = interaction.guild.id;

	if (!connection.state.subscription.player) {
		return interaction.followUp(
			'I am not currently playing music in a voice channel.',
		);
	}

	connection.state.subscription.player.stop();
	musicQueue.clearQueue(guildId);

	return interaction.followUp('Stopped the music and cleared the queue.');
}

module.exports.stopCommand = stopCommand;