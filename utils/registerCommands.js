const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const ConsolerLogger = require('./logger');

const logger = new ConsolerLogger();

async function registerCommands(clientId, token) {
	const commands = [
		new SlashCommandBuilder()
			.setName('play')
			.setDescription('Plays songs!')
			.addStringOption((option) => option
				.setName('input')
				.setDescription('Play song from YouTube, Spotify, SoundCloud, etc.')
				.setRequired(true)),
		new SlashCommandBuilder()
			.setName('queue')
			.setDescription('Adds a song to the queue!')
			.addStringOption((option) => option
				.setName('song')
				.setDescription(
					'Add song from YouTube, Spotify, SoundCloud, etc. to the queue',
				)
				.setRequired(true)),
		new SlashCommandBuilder()
			.setName('pause')
			.setDescription('Pauses the current song!'),
		new SlashCommandBuilder()
			.setName('resume')
			.setDescription('Resumes the current song!'),
		new SlashCommandBuilder()
			.setName('loop')
			.setDescription('Loops the current song! (toggle)'),
		new SlashCommandBuilder()
			.setName('stop')
			.setDescription('Stops the current song!'),
		new SlashCommandBuilder()
			.setName('skip')
			.setDescription('Skips the current song!'),
		new SlashCommandBuilder()
			.setName('leave')
			.setDescription('Leaves the voice channel!'),
		new SlashCommandBuilder()
			.setName('previous')
			.setDescription('Plays the previous song!'),
	];

	const rest = new REST({
		version: '9',
	})
		.setToken(token);

	try {
		logger.register('Started refreshing application (/) commands.');

		await rest.put(Routes.applicationCommands(clientId), {
			body: commands,
		});

		logger.register('Successfully reloaded application (/) commands.');
	} catch (error) {
		logger.error('Failed to reload application (/) commands.');
	}
}

module.exports.registerCommands = registerCommands;