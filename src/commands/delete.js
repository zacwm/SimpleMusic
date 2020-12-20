// SimpleMusic - Command
const sm = require("../index");

sm.command(["delete", "d"], async (msg) => {
    if (msg.args[1] == "last") {
        sm.data[msg.guild.id].queue.splice(sm.data[msg.guild.id].queue.length - 1, 1);
        msg.react("🗑");
    } else if (!Number.isInteger(msg.args[1]) || msg.args[1] <= 0 || msg.args[1] >= sm.data[msg.guild.id].queue.length) {
        msg.channel.send("", {embed: {
            color: msg.colors.warn,
            title: "Invalid input"
        }});
    } else {
        sm.data[msg.guild.id].queue.splice((msg.args[1] || 1) - 1, 1);
        msg.react("🗑");
    }
});
