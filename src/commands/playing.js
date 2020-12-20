// SimpleMusic - Command
const sm = require("../index");

sm.command(["playing", "nowplaying", "np", "current", "now"], async (msg) => {
    let guildData = sm.data[msg.guild.id];
    if (guildData && guildData.playing) {
        if (guildData.statusMessage) {
            guildData.statusMessage.delete();
            delete sm.data[msg.guild.id].statusMessage;
        }
        let playedTime = Math.floor(guildData.playing.dispatcher.streamTime / 1000);
        let totalTime = parseInt(guildData.playing.song.duration);
        let playedPercent = Math.round(((playedTime / totalTime) * 100));
        function formatTime(duration) {   
            var hrs = ~~(duration / 3600);
            var mins = ~~((duration % 3600) / 60);
            var secs = ~~duration % 60;
            var ret = "";
            if (hrs > 0) ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return ret;
        }
        sm.data[msg.guild.id].statusMessage = await msg.channel.send("", {embed: {
            color: msg.colors.ok,
            thumbnail: { url: guildData.playing.song.thumbnail },
            title: guildData.playing.song.title,
            url: guildData.playing.song.url,
            description: `${formatTime(playedTime)} [${"■".repeat(playedPercent/5)}${"□".repeat(20 - (playedPercent/5))}] ${formatTime(totalTime)} (${playedPercent}%)${(guildData.loop ? "🔄" : "")}\n`,
            fields: [
                {
                    name: "Requested by",
                    value: `<@${guildData.playing.song.requester}>`,
                    inline: true
                },
                {
                    name: "Playing in",
                    value: `🔊 ${guildData.voiceConnection.channel.name}`,
                    inline: true
                }
            ]
        }});
    } else {
        msg.channel.send("", {embed: {
            color: msg.colors.ok,
            description: "There is no song currently playing."
        }});
    }
});