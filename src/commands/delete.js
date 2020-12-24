// SimpleMusic - Command
const sm = require("../index");
const player = require("./player");

sm.command(["delete", "d"], async (msg) => {
    if (msg.args[1] == "last") {
        player.players[msg.guild.id].queue.splice(player.players[msg.guild.id].queue.length - 1, 1);
        msg.react("🗑");
    } else if (!Number.isInteger(parseInt(msg.args[1])) || parseInt(msg.args[1]) <= 0 || parseInt(msg.args[1]) > player.players[msg.guild.id].queue.length) {
        msg.channel.send("", {embed: {
            color: msg.colors.warn,
            title: "Invalid input"
        }});
    } else {
        player.players[msg.guild.id].queue.splice((parseInt(msg.args[1]) || 1) - 1, 1);
        msg.react("🗑");
    }
});
