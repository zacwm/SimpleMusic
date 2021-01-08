const config = require("../config");
const fs = require("fs");
const sm = require("../index");
const player = require("./player");

let sources = {};
let defaultSource;

fs.readdirSync("./commands/sources").forEach(source => {
    if (source.startsWith('template.')) return;
    if (source.endsWith('.js')) {
        sm.log("source", `Loaded source ${source}`);
        sources[source.split('.')[source.split('.').length-2]] = require(`./sources/${source}`);
        if (source.startsWith('default.')) defaultSource = source.split('.')[source.split('.').length-2];
    }
});

exports.players = {};

exports.play = async (tracks, textChannel, guildId, voiceChannel) => {
    return new Promise(async (resolve, reject) => {
        if (!player.players.hasOwnProperty(guildId)) player.players[guildId] = { playing: null, channel: null, statusMessage: null, ...player.players[guildId]};
        player.players[guildId].queue = (!player.players[guildId] || !player.players[guildId].playing) ? tracks : player.players[guildId].queue.concat(tracks);
        player.players[guildId].channel = textChannel;
        if (!player.players[guildId].voiceConnection || (player.players[guildId].voiceConnection && !player.players[guildId].playing)) {
            voiceChannel.join()
            .then(async connection => {
                let song = player.players[guildId].queue.shift();
                player.players[guildId].statusMessage = await textChannel.send("", {embed: {
                    color: config.commands.colors.ok,
                    author: { name: "Now Playing" },
                    thumbnail: { url: song.thumbnail },
                    description: `[${song.title}](${song.url})`,
                    footer: {
                        text: (tracks.length > 1) ? `And added ${tracks.length} other track${(tracks.length > 1) ? 's' : ''} to the queue` : null,
                    }
                }});
                await player.playSong(connection, song);
                resolve();
            });
        } else {
            player.players[guildId].statusMessage = await textChannel.send("", {embed: {
                color: config.commands.colors.ok,
                author: { name: "Added to queue" },
                thumbnail: { url: tracks[0].thumbnail },
                description: `[${tracks[0].title}](${tracks[0].url})`,
                footer: {
                    text: (tracks.length > 1) ? `And ${tracks.length-1} other track${(tracks.length > 2) ? 's' : ''} to the queue` : null,
                }
            }});
            resolve();
        }
    });
    
}

// Play songs
exports.playSong = async (voiceConnection, song) => {
    if (!voiceConnection || !song) return;
    let guild = voiceConnection.channel.guild;
    if (player.players[guild.id].disconnect) clearTimeout(player.players[guild.id].disconnect);
    let dispatcher;
    if (sources[song.platform]) {
        if (!song.duration) song = { ...song,...await sources[song.platform].getInfo(song.url).then(r => r[0]) };
        dispatcher = voiceConnection.play(await sources[song.platform].getStream(song.url));
    } else {
        player.players[guild.id].statusMessage.channel.send("", {embed: {
            color: config.commands.colors.error,
            title: "Internal bot error",
            description: "Source not supported"
        }});
        player.players[guild.id].statusMessage.delete();
        sm.log("error", `User tryed to play song ${song.url} from ${song.platform}, but it's not currently supported`);
        setImmediate(player.nextSong, voiceConnection, guild.id);
        return;
    }
    voiceConnection.voice.setSelfDeaf(true);
    dispatcher.setVolume(config.music.volume / 100);
    player.players[guild.id].playing = { dispatcher, song }
    player.players[guild.id].voiceConnection = voiceConnection;
    sm.log("music", `Playing ${song.platform}:${song.url} in ${guild.name} (${guild.id})`);

    dispatcher.on("finish", () => {
        player.players[guild.id].statusMessage.delete();
        delete player.players[guild.id].statusMessage;
        dispatcher.destroy();
        player.nextSong(voiceConnection, guild.id);
    });
}

//-  Play next song in queue
exports.nextSong = async (voiceConnection, guildID) => {
    if (player.players[guildID].loop) player.players[guildID].queue.push(player.players[guildID].playing.song);
    player.players[guildID].playing = null;
    if (player.players[guildID].queue.length > 0) {
        let nextSong = player.players[guildID].queue.shift();
        player.players[guildID].channel.send("", {embed: {
            color: config.commands.colors.ok,
            description: `**Now Playing** [${nextSong.title}](${nextSong.url})`
        }}).then(m => {
            player.players[guildID].statusMessage = m;
        });
        player.playSong(voiceConnection, nextSong);
    } else {
        player.players[guildID].disconnect = setTimeout(function() { voiceConnection.disconnect(); }, config.music.disconnectTime);
    }
}

// Depending on query, grab it
exports.getQuery = (query, opts) => {
    opts = opts || {};
    return new Promise(async (resolve, reject) => {
        let songs = [];
        
        let sourcesNames = Object.keys(sources);

        for (j = 0; j < sourcesNames.length; j++) {
            if (sources[sourcesNames[j]].url.test(query)) {
                let results = await sources[sourcesNames[j]].getInfo(query).catch(e => {
                    reject(e);
                });
                results.forEach(songData => {
                    songs.push({ ...opts, ...songData, platform:sourcesNames[j]});
                });
                return resolve(songs);
            }
        }
        
        //- If search query
        player.search(query, 1).then(r=>{
            for (i = 0; i < r.length; i++) {
                r[i] = { ...opts, ...r[i] };
            }
            resolve(r);
        }).catch(e=>reject(e));
    });
}

exports.search = (query, n) => {
    return new Promise((resolve, reject) => {
        let songs = [];
        
        let sourcesNames = Object.keys(sources);
        let first = query.split(" ")[0];
        let sourceName;

        for (i = 0; i < sourcesNames.length; i++) {
            if (sourceName) break;
            for (j = 0; j < sources[sourcesNames[i]].alias.length; j++) {
                if (sourceName) break;
                if (sources[sourcesNames[i]].alias[j] == first) {
                    sourceName = sourcesNames[i];
                    query = query.slice(first.length+1);
                    break;
                }
            }
        }
        if (!sourceName) sourceName = defaultSource;

        sources[sourceName].search(query, n).then(r=>{
            for (i = 0; i < r.length; i++) {
                r[i] = { platform:sourceName, ...r[i] };
            }
            resolve(r);
        }).catch(e=>reject(e));
    });
}