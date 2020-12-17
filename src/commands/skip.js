// SimpleMusic - Command
const sm = require("../index");
const play = require("./play");

sm.command(["skip", "s"], (msg) => {
    if (!((sm.data[msg.guild.id] && sm.data[msg.guild.id].voiceConnection) && sm.data[msg.guild.id].voiceConnection.channel.id !== msg.member.voice.channel.id)) {
        let guildData = sm.data[msg.guild.id];
        if (guildData && guildData.playing) {
            msg.react("👍");
            guildData.statusMessage.delete();
            delete sm.data[msg.guild.id].statusMessage;
            guildData.playing.dispatcher.destroy();
            play.nextSong(guildData.voiceConnection, msg.guild.id);
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