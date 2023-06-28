/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
const {
	createAudioResource,
	createAudioPlayer,
	NoSubscriberBehavior,
	AudioPlayerStatus,
} = require('@discordjs/voice');
const process = require('dotenv').config();

const { clientId } = process.parsed;

const { EmbedBuilder } = require('discord.js');
const musicQueue = require('../musicQueue');
const { progressBar } = require('./progress');

const currentInteractionIds = new Map();
const currentInteractions = new Map();
const oldConnections = [];
const timeoutTimer = new Map();

// TODO FIX THIS SHIT!!! ISSUES WITH DISPLAYING NAME AND STATUS WHEN UPDATING
function nowPLayingMessage(interaction, song, oldInteractionId) {
	progressBar(0, 0, true);

	if (interaction.commandName === 'play') {
		interaction.followUp('~🎵~').then((message) => {
			const songTitle = song.title;
			// const embed = new EmbedBuilder()
			// 	.setColor('#E0B0FF')
			// 	.setTitle(`Now playing: ${songTitle}`)
			// 	.setDescription(
			// 		progressBar(song.duration, 10).progressBarString,
			// 	);
			const embed = new EmbedBuilder()
				.setColor('#E0B0FF')
				.setTitle(`Now playing: ${songTitle}`);

			message.edit({
				embeds: [embed],
			});

			const inter = setInterval(async () => {
				const { progressBarString, isDone } = progressBar(
					song.duration,
					10,
				);
				if (isDone || message.id !== oldInteractionId) {
					// clearInterval(inter);
					return;
				}

				if (message.id != null && interaction.guild.id !== oldInteractionId) {
					interaction.channel.messages.fetch().then(async (channel) => {
						const filter = channel.filter((msg) => msg.author.id === clientId);
						const latestMessage = await interaction.channel.messages.fetch(filter.first().id);
						latestMessage.edit({
							embeds: [embed.setTitle(`Now playing: ${songTitle}`)],
						});
					});
				}
			}, 2000);

			currentInteractionIds.set(interaction.guild.id, interaction);
			currentInteractions.set(interaction.guild.id, interaction.id);
		});
	}
}

async function musicPlayer(guildId, connection, interaction) {
	try {
		const oldInteractions = await currentInteractions.get(interaction.guild.id);
		const oldInteractionId = await currentInteractionIds.get(interaction.guild.id);
		const serverQueue = musicQueue.getQueue(guildId);
		const oldConnection = oldConnections
			.find((guidConnection) => guidConnection[0] === interaction.guild.id);

		if (serverQueue.length === 0) {
			oldConnection[1].destroy();
		}

		const song = serverQueue[0];

		if (song.stream === undefined) {
			musicQueue.removeFromQueue(guildId);
			musicPlayer(guildId, connection);
			return;
		}

		const resource = createAudioResource(song.stream, {
			inputType: song.type,
		});

		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play,
			},
		});

		player.play(resource);

		connection.subscribe(player);

		nowPLayingMessage(interaction, song, oldInteractions);

		oldConnections.push([interaction.guild.id, connection]);

		player.on(AudioPlayerStatus.Idle, async () => {
			console.log('Song ended:', song.title);
			if (serverQueue.length !== 1) {
				await musicQueue.removeFromQueue(guildId);
				musicPlayer(guildId, connection, interaction);
			}

			// timeoutTimer.set(guildId, setTimeout(async () => {
			// 	await musicQueue.removeFromQueue(guildId);
			// 	connection.destroy();
			// }, 10000));
		});

		player.on(AudioPlayerStatus.Playing, () => {
			console.log('pausing timer');
			clearTimeout(
				timeoutTimer.get(guildId),
			);
		});

		if (oldInteractionId) {
			oldInteractionId.channel.messages.fetch().then(async (channel) => {
				const { lastMessage } = oldInteractionId.channel;
				const filter = channel.filter((message) => message.author.id === clientId && message.id !== lastMessage.id);
				setTimeout(() => {
					oldInteractionId.channel.bulkDelete(filter);
				}, 1000);
			});
		}
	} catch (error) {
		console.error(error);
		interaction.followUp('There was an error playing the song.');
	}
}

module.exports.musicPlayer = musicPlayer;