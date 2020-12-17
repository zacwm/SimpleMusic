// SimpleMusic - Command
const sm = require("../index");

sm.command(["ping"], (msg) => {
    msg.channel.send("", {embed: {
        color: msg.colors.ok,
        description: "Pong!"
    }}); 
});

