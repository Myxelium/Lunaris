const { playCommand } = require('./play.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { queueCommand } = require('./commands/queue');
const { registerCommands } = require('./utils/registerCommands');
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
    }
});
  

// client.login(process.env.TOKEN);
client.login(token);