const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

async function registerCommands(clientId, token) {
  const commands = [
    new SlashCommandBuilder()
      .setName('play')
      .setDescription('Plays songs!')
      .addStringOption(option =>
        option.setName('input')
          .setDescription('Play song from YouTube, Spotify, SoundCloud, etc.')
          .setRequired(true)
      ),
    new SlashCommandBuilder()
      .setName('queue')
      .setDescription('Adds a song to the queue!')
      .addStringOption(option =>
        option.setName('song')
          .setDescription('Add song from YouTube, Spotify, SoundCloud, etc. to the queue')
          .setRequired(true)
      ),
    new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song!'),
    new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the current song!'),   
    new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loops the current song! (toggle)'),
  ];

  const rest = new REST({ version: '9' }).setToken(token);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

module.exports.registerCommands = registerCommands;