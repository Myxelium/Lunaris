const {
    createAudioResource,
    createAudioPlayer,
    NoSubscriberBehavior,
    AudioPlayerStatus,
} = require('@discordjs/voice');

const { EmbedBuilder } = require('discord.js');
const musicQueue = require('../musicQueue');
const { progressBar } = require('../utils/progress');

async function musicPlayer(guildId, connection, interaction) {
    const serverQueue = musicQueue.getQueue(guildId);

    if (serverQueue.length === 0) {
        connection.destroy();
        return;
    }

    const song = serverQueue[0];

    if (song.stream == null) {
        musicQueue.removeFromQueue(guildId);
        musicPlayer(guildId, connection);
        return;
    }

    let resource = createAudioResource(song.stream, {
        inputType: song.type
    })

    let player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play
        }
    })

    player.play(resource)

    connection.subscribe(player)

    progressBar(0, 0, true)

    if(interaction.commandName == "play") {
        interaction.followUp(`~🎵~`).then(message => {
            const embed = new EmbedBuilder()
                .setColor("#E0B0FF")
                .setTitle("Now playing: " + song.title)
                .setDescription(progressBar(song.duration, 10).progressBarString);
        
            message.edit({ embeds: [embed] });
        
            inter = setInterval(() => {
                const { progressBarString, isDone } = progressBar(song.duration, 10);
                if (isDone) {
                    clearInterval(inter);
                    message.delete();
                }
                embed.setDescription(progressBarString);
                message.edit({ embeds: [embed] });
            }, 2000)
        });   
    }

    player.on(AudioPlayerStatus.Idle, async () => {
        console.log('Song ended:', song.title);
        await musicQueue.removeFromQueue(guildId)
        musicPlayer(guildId, connection, interaction);
    });

    return player;
}

module.exports.musicPlayer = musicPlayer;