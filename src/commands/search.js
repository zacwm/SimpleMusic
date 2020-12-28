// SimpleMusic - Command
const config = require("../config");
const sm = require("../index");
const player = require("./player");

sm.command(["search"], async (msg) => {
    let query = msg.content.substring(msg.args[0].length + 1);
    if (query) {  
        msg.channel.startTyping();
        let results = await player.search(query, 10);
        var pageData = [];
        results.forEach((song, index) => {
            pageData.push(`**${index + 1})** [${song.title}](${song.url})`);
        });
        msg.channel.send("", { embed: {
            color: msg.colors.ok,
            title: `Search results for "${query}":`,
            description: `${pageData.join("\n")}`,
            footer: { text: `'${config.commands.prefix}play [number]' to select a track to play` }
        }});
        if(!player.players[msg.guild.id]) player.players[msg.guild.id] = {};
        player.players[msg.guild.id].searchResults = results;

        msg.channel.stopTyping();
    }
});