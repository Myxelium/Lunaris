const { Client, GatewayIntentBits } = require('discord.js');
const { registerCommands } = require('./utils/registerCommands');
const { playCommand } = require('./commands/play');
const { queueCommand } = require('./commands/queue');
const { pauseCommand } = require('./commands/pause');
const { resumeCommand } = require('./commands/resume');
const { loopCommand } = require('./commands/loop');

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
    ] })

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
      await resumeCommand(interaction);
    } else if (commandName === 'loop') {
      await loopCommand(interaction);
    }
  });
  

// client.login(process.env.TOKEN);
client.login(token);