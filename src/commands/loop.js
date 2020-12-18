// SimpleMusic - Command
const sm = require("../index");

sm.command(["loop", "l"], async (msg) => {
    if (sm.data[msg.guild.id].loop) {
        sm.data[msg.guild.id].loop = false;
        sm.data[msg.guild.id].statusMessage = await msg.channel.send("", {embed: {
            color: msg.colors.warn,
            title: "Looping disabled"
        }});
    } else {
        sm.data[msg.guild.id].loop = true;
        sm.data[msg.guild.id].statusMessage = await msg.channel.send("", {embed: {
            color: msg.colors.ok,
            title: "Looping enabled"
        }});
    }
});