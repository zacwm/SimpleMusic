// currently disabled cause broken


// SimpleMusic - Source
const config = require("../../config");

const bcfetch = require('bandcamp-fetch');

exports.alias = []; // Disabled search because unavailable, tho would be ['bandcamp', 'bc']

exports.url = /(https?:\/\/)?\w+\.bandcamp.com\/(track|album)\/.+/;

exports.getStream = async (url) => {
    return new Promise(async (resolve, reject) => {
        resolve(await bcfetch.getTrackInfo(url).then(res => res.streamUrl));
    });
}

exports.getInfo = (url) => {
    console.log(url);
    return new Promise(async (resolve, reject) => {
        let tracks = [];
        if (/(https?:\/\/)?\w+\.bandcamp.com\/album\/.+/.test(url)) { // If album add all songs
            await bcfetch.getAlbumInfo(url).then(res => res.tracks.forEach(song => tracks.push({title: song.name, url: song.url, author:res.artist.name, authorUrl:res.artist.url, thumbnail:res.imageUrl, duration:song.duration})));
        } else { // If track
            await bcfetch.getTrackInfo(url).then(console.log);
            await bcfetch.getTrackInfo(url).then(res => tracks.push({title: res.name, url: res.url, author:res.artist.name, authorUrl:res.artist.url, thumbnail:res.imageUrl, duration:res.duration}))
        }
        console.log("tracks", tracks)
        resolve(tracks);
    });
}

exports.search = (query, n) => {
    return new Promise(async (resolve) => {
        resolve([]); // no api available for now
    });
}