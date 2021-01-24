// SimpleMusic - Source
const config = require("../../config");

const youtubenode = require("youtube-node");
const ytdl = require("ytdl-core");
const ytnode = new youtubenode();
ytnode.setKey(config.credentials.youtube);

exports.alias = ['youtube', 'yt'];

exports.url = /(?:youtube.[a-z]+\/[a-z\?\&]*(v|list)[/|=]|youtu.be\/)([0-9a-zA-Z-_]+)/i;

exports.getStream = (url) => {
    return ytdl(url);
}

exports.getInfo = (url) => {
    return new Promise(async (resolve, reject) => {
        if (/(?:youtube.[a-z]+\/[a-z\?\&]*v[/|=]|youtu.be\/)([0-9a-zA-Z-_]+)/i.test(url)) {
            ytdl.getInfo(url).then(info => {
                resolve([{title: info.videoDetails.title, url: url, duration: info.is_live ? 0 : info.videoDetails.lengthSeconds, thumbnail: `https://img.youtube.com/vi/${info.videoDetails.videoId}/maxresdefault.jpg`}]);
            }).catch(e => {
                reject(e);
            });
        } else if (/(?:youtube.[a-z]+\/[a-z\?\&]*list[/|=]|youtu.be\/)([0-9a-zA-Z-_]+)/i.test(url)) {
            ytnode.getPlayListsItemsById(new URLSearchParams(new URL(url).search).get('list'), (error, result) => { // this is currently limited by the library to 5 maximum results
                if (error) {
                    reject(error);
                } else {
                    let playlist = [];
                    result.items.forEach(info => {
                        playlist.push({title: info.snippet.title, thumbnail: `https://img.youtube.com/vi/${info.contentDetails.videoId}/maxresdefault.jpg`, url:`https://www.youtube.com/watch?v=${info.contentDetails.videoId}`, author: info.snippet.channelTitle, authorUrl: `https://www.youtube.com/channel/${info.snippet.channelId}`});
                    });
                    resolve(playlist);
                }
            });
        } else {
            reject({message: 'Unsupported url'});
        }
        
        
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