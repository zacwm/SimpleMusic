// SimpleMusic - Source
const config = require("../../config");

const youtubenode = require("youtube-node");
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
        ytdl.getInfo(url).then(info => {
            if (info.is_live) reject({message: "Unable to play live streams"});
            else {
                resolve([{title: info.videoDetails.title, url: url, duration: info.videoDetails.lengthSeconds, thumbnail: `https://img.youtube.com/vi/${info.videoDetails.videoId}/maxresdefault.jpg`}]);
            }
        }).catch(e => {
            reject(err);
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