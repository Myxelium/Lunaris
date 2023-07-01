const { Client, GatewayIntentBits } = require('discord.js');
const process = require('dotenv').config();
const { getVoiceConnection } = require('@discordjs/voice');
const { registerCommands } = require('./utils/registerCommands');
const { playCommand } = require('./commands/play');
const { queueCommand } = require('./commands/queue');
const { stopCommand } = require('./commands/stop');
const { pauseCommand, unpauseCommand } = require('./commands/pauseResume');
const { toggleLoopCommand } = require('./commands/loop');
const { skipCommand } = require('./commands/skip');
const { leaveCommand } = require('./commands/leave');
const { previousCommand } = require('./commands/previous');
const { ReAuth } = require('./reAuthenticate');
const ConsolerLogger = require('./utils/logger');

const { clientId } = process.parsed;
const { token } = process.parsed;

const logger = new ConsolerLogger();
const botClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildIntegrations,
	],
});

botClient.on('ready', async () => {
	logger.info(`Logged in as ${botClient.user.tag}!`);
	botClient.user.setActivity('League of Legends', 0);

	await registerCommands(clientId, token);
});

botClient.on('voiceStateUpdate', (oldState) => {
	const voiceChannel = oldState.channel;
	if (voiceChannel && voiceChannel.members.size === 1) {
		const connection = getVoiceConnection(voiceChannel.guild.id);
		if (connection) {
			connection.disconnect();
			connection.destroy();
		}
	}
});

botClient.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'play') {
		await playCommand(interaction, botClient);
	} else if (commandName === 'queue') {
		await queueCommand(interaction);
	} else if (commandName === 'pause') {
		await pauseCommand(interaction);
	} else if (commandName === 'resume') {
		await unpauseCommand(interaction);
	} else if (commandName === 'loop') {
		await toggleLoopCommand(interaction);
	} else if (commandName === 'stop') {
		await stopCommand(interaction);
	} else if (commandName === 'leave') {
		await leaveCommand(interaction);
	} else if (commandName === 'skip') {
		await skipCommand(interaction);
	} else if (commandName === 'previous') {
		await previousCommand(interaction);
	}
});

botClient.on('messageCreate', async (message) => {
	if (message.content === 'reauth') {
		await ReAuth();
	}
});

botClient.login(token);

module.exports.botClient = { botClient };