// SimpleMusic - Command
const sm = require("../index");

sm.command(["ping"], async (msg) => {
    let timeBefore = new Date();
    let botMessage = await msg.channel.send("", {embed: {
        color: msg.colors.ok,
        title: "Pong!"
    }});
    let timeAfter = new Date();

    botMessage.edit("", {embed: {
        color: msg.colors.ok,
        title: "Pong!",
        description: `It took us ${timeAfter-timeBefore} ms to reach discord.`
    }});

});

