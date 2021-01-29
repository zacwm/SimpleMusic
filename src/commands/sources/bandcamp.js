// SimpleMusic - Source
const config = require("../../config");

const fetch = require('node-fetch');

exports.alias = []; // Disabled search because unavailable, tho would be ['bandcamp', 'bc']

exports.url = /(https?:\/\/)?\w+\.bandcamp.com\/(track|album)\/.+/;

exports.getStream = async (url) => {
    return new Promise(async (resolve, reject) => {
        let data = await extractData(url);
        let albumData = await extractData(data.inAlbum['@id']);
        let trackData = albumData.track.itemListElement[albumData.track.itemListElement.map(function (item) { return item.item['@id']; }).indexOf(data['@id'])].item;
        resolve(trackData.file[0][1]);
    });
}

exports.getInfo = (url) => {
    return new Promise(async (resolve, reject) => {
        let data = await extractData(url);
        let tracks = [];
        if (data['@type'] == "MusicAlbum") { // If album add all songs
            data.track.itemListElement.forEach(song => {
                tracks.push({title: song.item.name, url: song.item.url, author: data.byArtist.name, authorUrl: data.byArtist['@id'], thumbnail:data.image, duration:parseInt(song.item.duration_secs)})
            });
        } else { // If track get album for info and add
            let albumData = await extractData(data.inAlbum['@id']);
            let trackData = albumData.track.itemListElement[albumData.track.itemListElement.map(function (item) { return item.item['@id']; }).indexOf(data['@id'])].item;
            tracks.push({title: trackData.name, url: trackData.url, author: albumData.byArtist.name, authorUrl: albumData.byArtist['@id'], thumbnail:albumData.image, duration:parseInt(trackData.duration_secs)});
        }
        resolve(tracks);
    });
}

exports.search = (query, n) => {
    return new Promise(async (resolve) => {
        resolve([]); // no api available for now
    });
}

async function extractData(url) {
    return new Promise(async (resolve, reject) => {
        let page = await fetch(url).then(res => res.text());
        let dataStart = page.indexOf('<script type="application/ld+json">')+35;
        let dataEnd = page.indexOf('</script>', dataStart)
        resolve(JSON.parse(page.slice(dataStart, dataEnd)));
    });
}