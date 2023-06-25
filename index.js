const { Client, GatewayIntentBits } = require('discord.js');
const { registerCommands } = require('./utils/registerCommands');
const { playCommand } = require('./commands/play');
const { queueCommand } = require('./commands/queue');
const { stopCommand } = require('./commands/stop');
const { pauseCommand, unpauseCommand } = require('./commands/pauseResume');
const { toggleLoopCommand } = require('./commands/loop');
const { ReAuth } = require('./ReAuthenticate');

const process = require('dotenv').config();
const clientId = process.parsed.clientId;
const token = process.parsed.token;

const client = new Client({ 
  intents: [
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildMessages, 
      GatewayIntentBits.MessageContent, 
      GatewayIntentBits.GuildVoiceStates, 
      GatewayIntentBits.GuildIntegrations
  ]
})

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    await registerCommands(clientId, token);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'play') {
    await playCommand(interaction);
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
  if(message.content == 'reauth') {
    await ReAuth();
  }
});

client.login(token);