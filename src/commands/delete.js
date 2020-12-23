// SimpleMusic - Command
const sm = require("../index");
const player = require("./player");

sm.command(["delete", "d"], async (msg) => {
    if (msg.args[1] == "last") {
        player.players[msg.guild.id].queue.splice(player.players[msg.guild.id].queue.length - 1, 1);
        msg.react("🗑");
    } else if (!Number.isInteger(msg.args[1]) || msg.args[1] <= 0 || msg.args[1] >= player.players[msg.guild.id].queue.length) {
        msg.channel.send("", {embed: {
            color: msg.colors.warn,
            title: "Invalid input"
        }});
    } else {
        player.players[msg.guild.id].queue.splice((msg.args[1] || 1) - 1, 1);
        msg.react("🗑");
    }
});
