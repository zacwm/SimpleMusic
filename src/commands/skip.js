// SimpleMusic - Command
const sm = require("../index");
const play = require("./play");
const player = require("./player");

sm.command(["skip", "s"], (msg) => {
    if (!((player.players[msg.guild.id] && player.players[msg.guild.id].voiceConnection) && player.players[msg.guild.id].voiceConnection.channel.id !== msg.member.voice.channel.id)) {
        let guildData = player.players[msg.guild.id];
        if (guildData && guildData.playing) {
            msg.react("👍");
            guildData.statusMessage.delete();
            delete player.players[msg.guild.id].statusMessage;
            guildData.playing.dispatcher.destroy();
            player.nextSong(guildData.voiceConnection, msg.guild.id);
        } else {
            msg.channel.send("", {embed: {
                color: msg.colors.warn,
                description: "There is no song currently playing."
            }});
        }
    } else {
        msg.channel.send("", {embed: {
            color: msg.colors.warn,
            description: `${msg.author}, I'm already active in another voice channel.`
        }});
    }
});