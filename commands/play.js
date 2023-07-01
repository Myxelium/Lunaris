/* eslint-disable consistent-return */
const { joinVoiceChannel } = require('@discordjs/voice');
const { getMusicStream } = require('../utils/getMusicStream');
const musicQueue = require('../musicQueue');
const { musicPlayer } = require('../utils/musicPlayer');

async function playCommand(interaction) {
	await interaction.deferReply();

	const query = interaction.options.getString('input');
	const voiceChannel = interaction.member.voice.channel;

	if (!voiceChannel) {
		return interaction.followUp(
			'You must be in a voice channel to use this command.',
		);
	}
	const song = await getMusicStream(query);

	const connection = joinVoiceChannel({
		channelId: voiceChannel.id,
		guildId: interaction.guild.id,
		adapterCreator: interaction.guild.voiceAdapterCreator,
		selfDeaf: false,
		selfMute: false,
	});

	if (musicQueue.getQueue(interaction.guild.id).length > 0) {
		musicQueue.removeFromQueue(interaction.guild.id);
		musicQueue.addToQueue(interaction.guild.id, song, true);
	} else {
		musicQueue.addToQueue(interaction.guild.id, song);
	}

	musicPlayer(
		interaction.guild.id,
		connection,
		interaction,
	);
}

module.exports.playCommand = playCommand;