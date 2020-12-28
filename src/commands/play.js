// SimpleMusic - Command
const config = require("../config");
const sm = require("../index");
const player = require("./player");

sm.command(["play", "p"], async (msg) => {
    let query = msg.content.substring(msg.args[0].length + 1);
    if (query) { // If user is requesting to queue a song.
        if (msg.member.voice.channel) { // Check if user is in a voice channel.
            if (msg.member.voice.channel.permissionsFor(sm.client.user).has("CONNECT")) { // Check if bot has permissions to connect to the members voice channel.
                if (true) { // Insert later: Check for activity in another guild voice channel.
                    msg.channel.startTyping();
                    if (Number.isInteger(parseInt(query))) {
                        if (!player.players[msg.guild.id].searchResults) {
                            msg.channel.send("", {embed: {
                                color: msg.colors.warn,
                                description: "You need to first make a search with !search (platform) [query]"
                            }});
                        } else if (player.players[msg.guild.id].searchResults[parseInt(query) - 1] != undefined) {
                            await player.play([{ channel: msg.channel.id, requester: msg.author.id, ...player.players[msg.guild.id].searchResults[parseInt(query)-1]}], msg.channel, msg.guild.id, msg.member.voice.channel);player.players[msg.guild.id].searchResults = null;
                        } else {
                            msg.channel.send("", {embed: {
                                color: msg.colors.error,
                                description: "Invalid range"
                            }});
                        }
                        msg.channel.stopTyping();
                    } else {
                        player.getQuery(query, { channel: msg.channel.id, requester: msg.author.id })
                        .then(async res => {
                            await player.play(res, msg.channel, msg.guild.id, msg.member.voice.channel);
                            msg.channel.stopTyping();
                        })
                        .catch(err => {
                            console.log(err);
                            msg.channel.stopTyping();
                            if (err.err) sm.log('error', err.err);
                            
                            msg.channel.send("", {embed: {
                                color: msg.colors.warn,
                                title: `Error`,
                                description: err.message || "No details given"
                            }});
                        });
                    }
                    
                }
            } else {
                msg.channel.send("", {embed: {
                    color: msg.colors.error,
                    description: "I don't have permission to see or join that voice channel."
                }}); 
            }
        } else {
            msg.channel.send("", {embed: {
                color: msg.colors.warn,
                description: "You must be in a voice channel first."
            }}); 
        }
    }
});
