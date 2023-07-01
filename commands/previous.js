const { joinVoiceChannel } = require('@discordjs/voice');
const musicQueue = require('../musicQueue');
const { musicPlayer } = require('../utils/musicPlayer');

function previousCommand(interaction) {
	// Get the server queue
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

	// Check if there is a previous song in the queue
	if (serverQueue.previous === undefined) {
		return interaction.reply('There is no previous song to go back to!');
	}

	// Add the previous song back to the front of the queue
	musicQueue.addToQueue(interaction.guild.id, serverQueue.previous, true);

	// Play the previous song
	musicPlayer(interaction.guild.id, connection, interaction);

	return interaction.reply('Went back to the previous song!');
}

module.exports.previousCommand = previousCommand;