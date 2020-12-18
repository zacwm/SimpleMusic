// SimpleMusic - Command
const sm = require("../index");

sm.command(["stop", "disconnect", "leave"], (msg) => {
    let cmdGuild = sm.data[msg.guild.id];
    sm.data[msg.guild.id].loop = false;
    if (cmdGuild && cmdGuild.voiceConnection) cmdGuild.voiceConnection.disconnect();
    msg.react("👍");
});