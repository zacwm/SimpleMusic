// SimpleMusic - Command
const sm = require("../index");
const player = require("./player");

sm.command(["loop", "l"], async (msg) => {
    player.players[msg.guild.id].loop = !player.players[msg.guild.id].loop;
    player.players[msg.guild.id].statusMessage = await msg.channel.send("", {embed: {
        color: msg.colors.ok,
        description: `Looping is now **${(player.players[msg.guild.id].loop) ? "enabled" : "disabled"}**`
    }});
});
