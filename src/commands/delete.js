// SimpleMusic - Command
const sm = require("../index");

sm.command(["delete", "d"], async (msg) => {
    if (msg.args[1] == "last") {
        sm.data[msg.guild.id].queue.splice(sm.data[msg.guild.id].queue.lenght - 1, 1);
        msg.react("🗑");
    } else if (!isInteger(msg.args[1]) || msg.args[1] <= 0 || msg.args[1] >= sm.data[msg.guild.id].queue.lenght) {
        msg.react("❌");
    } else {
        sm.data[msg.guild.id].queue.splice((msg.args[1] || 1) - 1, 1);
        msg.react("🗑");
    }
});