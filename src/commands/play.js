// SimpleMusic - Command
const config = require("../config");
const ytdl = require("ytdl-core");
const youtubenode = require("youtube-node");
const youtubedl = require('youtube-dl');
const sm = require("../index");
const ytnode = new youtubenode();
ytnode.setKey(config.credentials.youtube);

exports.nextSong = nextSong;

sm.command(["play", "p"], (msg) => {
    let query = msg.content.substring(msg.args[0].length + 1);
    if (query) { // If user is requesting to queue a song.
        if (msg.member.voice.channel) { // Check if user is in a voice channel.
            if (msg.member.voice.channel.permissionsFor(sm.client.user).has("CONNECT")) { // Check if bot has permissions to connect to the members voice channel.
                if (true) { // Insert later: Check for activity in another guild voice channel.
                    if (!sm.data.hasOwnProperty(msg.guild.id)) sm.data[msg.guild.id] = { playing: null, channel: null, statusMessage: null };
                    msg.channel.startTyping();
                    getQuery(query, { channel: msg.channel.id, requester: msg.author.id })
                    .then(res => {
                        sm.data[msg.guild.id].queue = (!sm.data[msg.guild.id] || !sm.data[msg.guild.id].playing) ? res : sm.data[msg.guild.id].queue.concat(res);
                        sm.data[msg.guild.id].channel = msg.channel;
                        if (!sm.data[msg.guild.id].voiceConnection || (sm.data[msg.guild.id].voiceConnection && !sm.data[msg.guild.id].playing)) {
                            msg.member.voice.channel.join()
                            .then(async connection => {
                                let song = sm.data[msg.guild.id].queue.shift();
                                sm.data[msg.guild.id].statusMessage = await msg.channel.send("", {embed: {
                                    color: msg.colors.ok,
                                    author: { name: "Now Playing" },
                                    thumbnail: { url: song.thumbnail },
                                    description: `[${song.title}](${song.url})`
                                }});
                                playSong(connection, song);
                            });
                        } else if (res.length == 1) {
                            msg.channel.send("", {embed: {
                                color: msg.colors.ok,
                                author: { name: "Added to queue" },
                                thumbnail: { url: res[0].thumbnail },
                                description: `[${res[0].title}](${res[0].url})`
                            }});
                        }
                        msg.channel.stopTyping();
                    })
                    .catch(err => {
                        msg.channel.stopTyping();
                        if (err.code == 403) {
                            msg.channel.send("", {embed: {
                                color: msg.colors.warn,
                                title: `Error from YouTube API`,
                                description: err.message || "No details given"
                            }});
                        } else {
                            msg.channel.send("", {embed: {
                                color: msg.colors.warn,
                                description: `No results were found for that query...`
                            }});
                        }
                    })
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

// Play songs from YouTube for connections
async function playSong(voiceConnection, song) {
    if (!voiceConnection || !song) return;
    let guild = voiceConnection.channel.guild;
    if (sm.data[guild.id].disconnect) clearTimeout(sm.data[guild.id].disconnect);
    let dispatcher;
    if (song.platform == 'youtube') {
        dispatcher = voiceConnection.play(ytdl(song.url, { quality: "lowestaudio", filter: "audioonly" }));
    } else if (song.platform == 'soundcloud') {
        dispatcher = voiceConnection.play(youtubedl(song.url, ['-f bestaudio']));
    } else {
        sm.data[guild.id].statusMessage.channel.send("", {embed: {
            color: config.commands.colors.error,
            title: "Internal bot error",
            description: "Source not supported"
        }});
        sm.data[guild.id].statusMessage.delete();
        sm.log("error", `User tryed to play song ${song.url} from ${song.platform}, but it's not currently supported`);
        setImmediate(nextSong, voiceConnection, guild.id);
        return;
    }
    dispatcher.setVolume(config.music.volume / 100);
    sm.data[guild.id].playing = { dispatcher, song }
    sm.data[guild.id].voiceConnection = voiceConnection;
    sm.log("music", `Playing ${song.platform}:${song.url} in ${guild.name} (${guild.id})`);

    dispatcher.on("finish", () => {
        sm.data[guild.id].statusMessage.delete();
        delete sm.data[guild.id].statusMessage;
        dispatcher.destroy();
        nextSong(voiceConnection, guild.id);
    });
}

//-  Play next song in queue
async function nextSong(voiceConnection, guildID) {
    sm.data[guildID].playing = null;
    if (sm.data[guildID].queue.length > 0) {
        let nextSong = sm.data[guildID].queue.shift();
        if (sm.data[guildID].loop) {
            sm.data[guildID].queue.push(nextSong);
        }
        sm.data[guildID].channel.send("", {embed: {
            color: config.commands.colors.ok,
            description: `**Now Playing** [${nextSong.title}](${nextSong.url})`
        }}).then(m => {
            sm.data[guildID].statusMessage = m;
        });
        playSong(voiceConnection, nextSong);
    } else {
        sm.data[guildID].disconnect = setTimeout(function() { voiceConnection.disconnect(); }, config.music.disconnectTime);
    }
}

// Depending on query, grab it lol.
let getQuery = (query, opts) => {
    opts = opts || {};
    return new Promise(async (resolve, reject) => {
        let songs = [];
        //- If YouTube video
        if (/(?:youtube.[a-z]+\/[a-z\?\&]*v[/|=]|youtu.be\/)([0-9a-zA-Z-_]+)/i.test(query)) {
            let videoID = query.match(/(?:youtube.[a-z]+\/[a-z\?\&]*v[/|=]|youtu.be\/)([0-9a-zA-Z-_]+)/i)[0].split("/")[1].replace(/watch\?v=/i, "");
            let songData = await getSongInfo(videoID);
            songs.push({ ...opts, ...songData });
            resolve(songs);
        } 
        //- If SoundCloud Track
        else if (/https{0,1}:\/\/w{0,3}\.*soundcloud\.com\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)[^< ]*/i.test(query)) {
            youtubedl.getInfo(query, [], function(err, info) {
                if (err) throw err
                
                songs.push({ ...opts, title: info.title, url: query, duration: info._duration_raw, thumbnail: info.thumbnail, platform:'soundcloud'});
            resolve(songs);
            });
        }
        //- If search query
        else {
            ytnode.search(query, 10, async (err, result) => {
                if (err) return reject(err);
                let resultFilter = result.items.filter(item => item.id.kind == "youtube#video");
                if (resultFilter.length > 0) {
                    function checkVideos(pos) {
                        getSongInfo(resultFilter[pos].id.videoId)
                        .then(songData => {
                            songs.push({ ...opts, ...songData });
                            resolve(songs);
                        }).catch(err => {
                            if (pos + 1 == resultFilter.length) return reject(2);
                            checkVideos(pos + 1);
                        });
                    }
                    checkVideos(0);
                } else reject(1);
            });
        }
    });
}

//= For getting single songs
let getSongInfo = (videoid) => {
    return new Promise(async (resolve, reject) => {
        let videoInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoid}`);
        let videoLength = Math.round(parseInt(videoInfo.videoDetails.lengthSeconds) / 60);
        if (videoInfo.videoDetails.isLiveContent) return reject(3);
        else if (videoLength <= config.music.maxSongTime) {
            resolve({ title: videoInfo.videoDetails.title, url: `https://www.youtube.com/watch?v=${videoInfo.videoDetails.videoId}`, duration: videoInfo.videoDetails.lengthSeconds, thumbnail: `https://img.youtube.com/vi/${videoInfo.videoDetails.videoId}/maxresdefault.jpg`, platform:'youtube'});
        } else return reject({type: 2, data: videoLength});
    });
}