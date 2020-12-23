// SimpleMusic - Source
const config = require("../../config");

const youtubenode = require("youtube-node");
const youtubedl = require('youtube-dl');
const ytdl = require('ytdl-core');
const ytnode = new youtubenode();
ytnode.setKey(config.credentials.youtube);

exports.alias = ['youtube', 'yt'];

exports.url = /(?:youtube.[a-z]+\/[a-z\?\&]*v[/|=]|youtu.be\/)([0-9a-zA-Z-_]+)/i;

exports.getStream = (url) => {
    return ytdl(url, { quality: "lowestaudio", filter: "audioonly" });
}

exports.getInfo = (url) => {
    return new Promise(async (resolve, reject) => {
        youtubedl.getInfo(url, [], function(err, info) {
            if (err) reject();
            else if (info.is_live) reject({message: "Unable to play live streams"});
            else {
                resolve({title: info.title, url: url, duration: info._duration_raw, thumbnail: info.thumbnail});
            }
        });
    });
}

exports.search = (query, n) => {
    return new Promise((resolve, reject) => {
        ytnode.search(query, n || 20, {type: 'video'}, async (err, result) => {
            if (err) return reject(err);
            let resultFiltered = [];
            result.items.forEach((video)=>{
                resultFiltered.push({title: video.snippet.title, url: `https://www.youtube.com/watch?v=${video.id.videoId}`, thumbnail: `https://img.youtube.com/vi/${video.id.videoId}/maxresdefault.jpg`, author: video.snippet.channelTitle, authorUrl: `https://www.youtube.com/channel/${video.snippet.channelId}`});
            });
            resolve(resultFiltered);
        });
    });
}