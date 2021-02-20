// SimpleMusic - Command
const sm = require("../index");
const player = require("./player");

sm.command(["stop", "disconnect", "leave"], (msg) => {
    let cmdGuild = player.players[msg.guild.id];
    if (cmdGuild && cmdGuild.voiceConnection) cmdGuild.voiceConnection.disconnect();
    msg.channel.stopTyping(true);
    msg.react("👍");
});