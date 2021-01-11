// SimpleMusic - Source
const config = require("../../config");

const fetch = require('node-fetch');

exports.alias = ['soundcloud', 'sc'];

exports.url = /https{0,1}:\/\/w{0,3}\.*soundcloud\.com\/([A-Za-z0-9_-]+)\/([A-Za-z0-9_-]+)[^< ]*/i;

exports.getStream = async (url) => {
    return new Promise(async (resolve, reject) => {
        let info = await fetch(`https://api-v2.soundcloud.com/resolve?url=${encodeURI(url)}&client_id=${await getClientId()}`).then(res => res.json()).catch(err => reject(err));

        if (info.error) {
            reject();
        } else {
            resolve(await fetch(`${info.media.transcodings[0].url}?client_id=${await getClientId()}`).then(res => res.json()).then(json => json.url).catch(err => reject(err)));
        }
    });
}

exports.getInfo = (url) => {
    return new Promise(async (resolve, reject) => {
        let info = await fetch(`https://api-v2.soundcloud.com/resolve?url=${encodeURI(url)}&client_id=${await getClientId()}`).then(res => res.json()).catch(err => reject(err));

        if (info.error) {
            reject();
        } else {
            if (info.kind == "track") {
                resolve([parseTrackData(info)]);
            } else if (info.kind = "playlist") {
                let playlist = [];
                let toFetch = "";
                
                info.tracks.forEach(trackInfo => {
                    if (trackInfo.permalink_url) {
                        playlist.push(parseTrackData(trackInfo));
                    } else {
                        if (toFetch != "") toFetch += ","+trackInfo.id;
                            else toFetch += trackInfo.id;
                    }
                });

                if (toFetch != "") {
                    let newInfo = await fetch(`https://api-v2.soundcloud.com/tracks?ids=${encodeURI(toFetch)}&client_id=${await getClientId()}`).then(res => res.json());
                    newInfo.forEach(trackInfo => {
                        playlist.push(parseTrackData(trackInfo));
                    });
                }
                resolve(playlist);
            } else {
                reject();
            }
        }
    });
}

exports.search = (query, n) => {
    return new Promise(async (resolve) => {
        let result = await fetch(`https://api-v2.soundcloud.com/search/tracks?q=${query}&client_id=${await getClientId()}&limit=${n || 20}&offset=0&linked_partitioning=1&app_locale=en`).then(res => res.json());
        let resultParsed = [];
        result.collection.forEach(info => {
            resultParsed.push(parseTrackData(info));
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

function parseTrackData(info) {
    return {title: info.title, url: info.permalink_url, author:info.user.username, authorUrl:info.user.permalink_url, thumbnail:info.artwork_url, duration:parseInt(info.duration/1000)};
}