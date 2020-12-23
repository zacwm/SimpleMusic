// SimpleMusic - Source
const youtubedl = require('youtube-dl');
const fetch = require('node-fetch');

exports.alias = ['soundcloud', 'sc'];

exports.url = /https{0,1}:\/\/w{0,3}\.*soundcloud\.com\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)[^< ]*/i;

exports.getStream = (url) => {
    return youtubedl(url, ['-f bestaudio']);
}

exports.getInfo = (url) => {
    return new Promise(async (resolve, reject) => {
        youtubedl.getInfo(url, [], function(err, info) {
            if (err) reject(4);
            else if (info.is_live) reject(3);
            else if (parseInt(info._duration_raw/60) <= config.music.maxSongTime) {
                resolve({title: info.title, url: url, duration: info._duration_raw, thumbnail: info.thumbnail});
            } else return reject({type: 2, data: parseInt(info._duration_raw/60)});
        });
    });
}

let clientId = null;

async function getClientId() {
    return new Promise(async (resolve) => {
        if (clientId == undefined) {
            await fetch('https://soundcloud.com/discover').then(res => res.text()).then(async body => {
                let scripts = body.match(/<script crossorigin src=".*\.js"><\/script>/g);
                let links = [];
                scripts.forEach(url => {
                    let startUrl = '<script crossorigin src="'.length;
                    let endUrl = url.indexOf('"><\/script>', startUrl);
                    links.push(url.slice(startUrl, endUrl));
                });
                for (i = 0; i < links.length; i++) {
                    let page = await fetch(links[i]).then(res => res.text());
                    let clientIds = page.match(/client_id:".{32}/g);
                    if (clientIds != null) {
                        clientId = clientIds[0].slice('client_id:"'.length);
                        return clientId;
                    }
                }
            });
        }
        resolve(clientId);
    });
}

exports.search = (query, n) => {
    return new Promise(async (resolve) => {
        let result = await fetch(`https://api-v2.soundcloud.com/search/tracks?q=${query}&client_id=${await getClientId()}&limit=${n || 20}&offset=0&linked_partitioning=1&app_locale=en`).then(res => res.json());
        let resultParsed = [];
        result.collection.forEach(song => {
            resultParsed.push({title: song.title, url: song.permalink_url, author: song.user.author, thumbnail:song.artwork_url, duration:song.duration});
        });
        resolve(resultParsed);
    });
}