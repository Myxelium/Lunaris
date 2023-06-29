const { Client, GatewayIntentBits } = require('discord.js');
const process = require('dotenv').config();
const { getVoiceConnection } = require('@discordjs/voice');
const { registerCommands } = require('./utils/registerCommands');
const { playCommand } = require('./commands/play');
const { queueCommand } = require('./commands/queue');
const { stopCommand } = require('./commands/stop');
const { pauseCommand, unpauseCommand } = require('./commands/pauseResume');
const { toggleLoopCommand } = require('./commands/loop');
const { ReAuth } = require('./reAuthenticate');

const { clientId } = process.parsed;
const { token } = process.parsed;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildIntegrations,
	],
});

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity('Use /play to play music.');

	await registerCommands(clientId, token);
});

client.on('voiceStateUpdate', (oldState) => {
	const voiceChannel = oldState.channel;
	if (voiceChannel && voiceChannel.members.size === 1) {
		const connection = getVoiceConnection(voiceChannel.guild.id);
		if (connection) {
			connection.disconnect();
			connection.destroy();
		}
	}
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'play') {
		await playCommand(interaction, client);
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
	}
});

client.on('messageCreate', async (message) => {
	if (message.content === 'reauth') {
		await ReAuth();
	}
});

client.login(token);