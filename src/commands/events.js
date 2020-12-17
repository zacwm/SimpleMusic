// SimpleMusic - *not a* command, i didn't know where to put this ok [https://imgur.com/a/4vAANna]
const config = require("../config");
const sm = require("../index");
const chalk = require("chalk");

// Ready
sm.client.on("ready", () => {
    console.log(chalk.cyan.bold("\n　　         　 　       ∧_,,∧　　　\n             　♪　　    (・ω・)　　♪\n               ＿＿＿ ＿○＿＿つヾ＿＿\n             /δ⊆・⊇ 。/†: :† /δ ⊆・⊇｡ /|\n            |￣￣￣￣￣￣￣￣￣￣￣ | |\n            |　　　　　　　　　　 　|"))
    sm.log("bot", `Ready! Logged in as ${sm.client.user.tag}`);
});

// Command message
sm.client.on("message", msg => {
    msg.args = msg.content.split(" ");
    msg.colors = config.commands.colors;
    if (msg.args[0].startsWith(config.commands.prefix)) {
        let command = msg.args[0].substring(1);
        if (!msg.guild) return;
        if (msg.author.bot) return;
        if (sm.commands.hasOwnProperty(command)) {
            if (config.commands.whitelist.hasOwnProperty(msg.guild.id) && config.commands.whitelist[msg.guild.id].some(r => msg.member.roles.cache.has(r))) runCommand()
            else if (config.commands.nonWhitelistServers) runCommand();
            else msg.react("❌");

            function runCommand() {
                sm.log("command", `${msg.author.tag} used '${msg.content}'`)
                sm.commands[command](msg);
            }
        }
    }
});

// Disconnection from a playing channel 
sm.client.on("voiceStateUpdate", (oldState, newState) => {
    if ((newState.member.id == sm.client.user.id && newState.connection == null) && sm.data[newState.guild.id]) {
        let guildData = sm.data[newState.guild.id];
        if (guildData.disconnect) clearTimeout(sm.data[newState.guild.id].disconnect);
        if (guildData.statusMessage) guildData.statusMessage.delete();
        if (guildData.playing) guildData.playing.dispatcher.destroy();
        delete sm.data[newState.guild.id];
        sm.log("music", `Disconnected from voice ${newState.guild.name} (${newState.guild.id})`);
    }
});