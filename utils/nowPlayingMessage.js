const process = require('dotenv').config();

const { clientId } = process.parsed;
const { EmbedBuilder } = require('discord.js');
const { progressBar } = require('./progress');

const currentInteractionIds = new Map();
const currentInteractions = new Map();
const messageTimerMap = new Map();
const intervalMap = new Map(); // Add a new map to keep track of interval IDs

function nowPlayingMessage(interaction, song, prematureEnd = false) {
	const timeoutIDs = messageTimerMap.get(interaction.guild.id);
	if (timeoutIDs) {
		timeoutIDs.forEach((timeoutID) => clearTimeout(timeoutID));
	}

	if (interaction.commandName === 'play') {
		interaction.followUp('~🎵~').then((message) => {
			const songTitle = song.title;
			const embed = new EmbedBuilder()
				.setColor('#E0B0FF')
				.setTitle(`Now playing: ${songTitle}`)
				.setDescription(
					progressBar(song.duration, 10).progressBarString,
				);

			message.edit({
				embeds: [embed],
			});

			const inter = setInterval(async () => {
				const messageString = progressBar(
					song.duration,
					10,
				);

				if (message.id != null) {
					interaction.channel.messages.fetch().then(async (channel) => {
						const filter = channel.filter((msg) => msg.author.id === clientId);
						const latestMessage = await interaction.channel.messages.fetch(filter.first().id);
						latestMessage.edit({
							embeds: [embed.setDescription(messageString.progressBarString)],
						});
					});
				}
			}, 1000);

			// Store the interval ID in the intervalMap
			intervalMap.set(interaction.guild.id, inter);

			// Store the timeoutID in an array associated with the key
			if (!messageTimerMap.has(interaction.guild.id) || !prematureEnd) {
				messageTimerMap.set(interaction.guild.id, []);
			}

			messageTimerMap.get(interaction.guild.id).push(inter);
			progressBar(0, 0, true);

			currentInteractionIds.set(interaction.guild.id, interaction);
			currentInteractions.set(interaction.guild.id, interaction.id);
		});
	}
}

module.exports.nowPlayingMessage = nowPlayingMessage;
module.exports.intervalMap = intervalMap;
module.exports.currentInteractionIds = currentInteractionIds;