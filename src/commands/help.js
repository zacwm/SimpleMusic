// SimpleMusic - Command
const sm = require("../index");

sm.command(["help", "info", "commands"], async (msg) => {
    
    msg.channel.send("", {embed: {
        color: msg.colors.ok,
        title: "Hey! 👋",
        description: `❤️ Thanks for using [SimpleMusic](https://github.com/zacimac/SimpleMusic)\nFor a list of commands [click here](https://github.com/zacimac/SimpleMusic#commands) \n🌟 Also be sure to star this repo on GitHub! `,
        fields: [
            {
                name: "Author",
                value: `[Zachary](https://github.com/zacimac)`,
                inline: true
            },
            {
                name: "Contributors",
                value: `[Enrico](https://github.com/Leone25)`,
                inline: true
            }
        ]
    }});
});

