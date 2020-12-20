// SimpleMusic - Command
const sm = require("../index");

sm.command(["loop", "l"], async (msg) => {
    sm.data[msg.guild.id].loop = !sm.data[msg.guild.id].loop;
    sm.data[msg.guild.id].statusMessage = await msg.channel.send("", {embed: {
        color: msg.colors.ok,
        description: `Looping is now **${(sm.data[msg.guild.id].loop) ? "enabled" : "disabled"}**`
    }});
});
