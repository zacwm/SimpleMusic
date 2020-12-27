// SimpleMusic - Source
const config = require("../../config");

const fetch = require('node-fetch');

exports.alias = ['soundcloud', 'sc'];

exports.url = /https{0,1}:\/\/w{0,3}\.*soundcloud\.com\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)[^< ]*/i;

exports.getStream = async (url) => {
    return await exports.getInfo(url).then(res => res.media.transcodings[0].url);
}

exports.getInfo = (url) => {
    return new Promise(async (resolve, reject) => {
        let info = await fetch(`https://api-v2.soundcloud.com/resolve?url=${encodeURI(url)}&client_id=${await getClientId()}`).then(res => res.json()).catch(err => reject(err));

        if (info.error) {
            reject();
        } else {
            resolve([{title: info.title, url: url, author:info.user.username, authorUrl:info.user.permalink_url, thumbnail:info.artwork_url, duration:info.duration}]);
        }
    });
}

exports.search = (query, n) => {
    return new Promise(async (resolve) => {
        let result = await fetch(`https://api-v2.soundcloud.com/search/tracks?q=${query}&client_id=${await getClientId()}&limit=${n || 20}&offset=0&linked_partitioning=1&app_locale=en`).then(res => res.json());
        let resultParsed = [];
        result.collection.forEach(song => {
            resultParsed.push({title: info.title, url: url, author:info.user.username, authorUrl:info.user.permalink_url, thumbnail:info.artwork_url, duration:song.duration});
        });
        resolve(resultParsed);
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