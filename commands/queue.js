const musicQueue = require("../musicQueue");
const { getMusicStream } = require("../utils/getMusicStream");

async function queueCommand(interaction) {
    await interaction.deferReply();

    const query = interaction.options.getString("song");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
        return interaction.followUp(
            "You must be in a voice channel to use this command."
        );
    }

    const song = await getMusicStream(query);
    if (!song) {
        return interaction
            .followUp("Error finding song. Try Again.")
            .then((msg) => setTimeout(() => msg.delete(), 10000));
    }

    musicQueue.addToQueue(interaction.guild.id, song);
    interaction.followUp(`Added ${song.title} to the queue.`);
}

module.exports.queueCommand = queueCommand;
