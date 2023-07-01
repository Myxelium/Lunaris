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

const musicQueue = require('../musicQueue');
const { nowPlayingMessage, intervalMap, currentInteractionIds } = require('./nowPlayingMessage');
const ConsolerLogger = require('./logger');

const oldConnections = [];
const timeoutTimer = new Map();
const logger = new ConsolerLogger();

async function musicPlayer(guildId, connection, interaction) {
	try {
		const oldInteractionId = await currentInteractionIds.get(interaction.guild.id);
		const serverQueue = musicQueue.getQueue(guildId);
		const oldConnection = oldConnections
			.find((guidConnection) => guidConnection[0] === interaction.guild.id);
		const song = serverQueue[0];

		if (!song || song.stream === undefined) {
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

		if (!resource.ended) {
			player.play(resource);
		} else {
			logger.warning('Song ended prematurely.', song.title);
		}

		connection.subscribe(player);

		nowPlayingMessage(interaction, song);

		oldConnections.push([interaction.guild.id, connection]);

		// Add an event listener for the Idle event of the audio player
		player.on(AudioPlayerStatus.Idle, async () => {
			logger.info(`Song ended: ${song.title}`, 'Started by:', interaction.user.username);
			// Check if the audio resource has ended
			if (resource.ended) {
				// If the audio resource has ended, play the next song

				if (serverQueue.length !== 0) {
					await musicQueue.removeFromQueue(guildId);
					musicPlayer(guildId, connection, interaction);
					logger.info(`Playing next song...${serverQueue}`);
				} else {
					// If there are no more songs in the queue, destroy the connection
					connection.destroy();
					logger.info('Connection destroyed.');
					// Clear the interval for updating the progress bar
					const interval = intervalMap.get(interaction.guild.id);
					clearInterval(interval);
				}
			}
		});

		player.on(AudioPlayerStatus.Playing, () => {
			logger.info(`Playing: ${song.title}, Started by: ${interaction.user.username}`);
			clearTimeout(
				logger.info('Previous song timer cleared.'),
				timeoutTimer.get(guildId),
			);
		});

		if (oldInteractionId) {
			oldInteractionId.channel.messages.fetch().then(async (channel) => {
				const { lastMessage } = oldInteractionId.channel;
				const filter = channel.filter((message) => message.author.id === clientId && message.id !== lastMessage.id);
				setTimeout(() => {
					logger.info('Removing old messages...');
					oldInteractionId.channel.bulkDelete(filter)
						.catch((error) => logger.error(error));
				}, 1000);
			});
		}
	} catch (error) {
		logger.error(error);
		interaction.followUp('There was an error playing the song.', { ephemeral: true });
	}
}

module.exports.musicPlayer = musicPlayer;