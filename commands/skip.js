const { joinVoiceChannel } = require('@discordjs/voice');
const musicQueue = require('../musicQueue');
const { musicPlayer } = require('../utils/musicPlayer');

async function skipCommand(interaction) {
	// Get the server queue
	interaction.deferReply();
	const serverQueue = musicQueue.getQueue(interaction.guild.id);

	const voiceChannel = interaction.member.voice.channel;

	if (!voiceChannel) {
		return interaction.followUp(
			'You must be in a voice channel to use this command.',
		);
	}

	const connection = joinVoiceChannel({
		channelId: voiceChannel.id,
		guildId: interaction.guild.id,
		adapterCreator: interaction.guild.voiceAdapterCreator,
		selfDeaf: false,
		selfMute: false,
	});

	// Check if there are any songs in the queue
	if (serverQueue.length === 0) {
		return interaction.reply('There are no songs in the queue to skip!');
	}

	// Remove the current song from the queue
	musicQueue.removeFromQueue(interaction.guild.id);

	// Play the next song
	await musicPlayer(interaction.guild.id, connection, interaction);

	return interaction.reply('Skipped to the next song!');
}

module.exports.skipCommand = skipCommand;