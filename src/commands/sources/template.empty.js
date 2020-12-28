// SimpleMusic - Source

// default.*.js file will be the first to be used to search and play if there is no source specified
// template.*.js files will be ignored

// const config = require("../../config"); // Uncomment this only if you need to access settings

// This is where you declare all the modules that you need locally, probably mostly youtube-dl
const youtubedl = require('youtube-dl');

// This is an array of all the names you want your source to be called with, usually and preferebly it's just the full name and a 2 letter short version
exports.alias = ['template','tm'];

// This contains a regexp that will be used to detect links from this source and will be used to call the propper source
exports.url = /https{0,1}:\/\/w{0,3}\.example.com/i;

// This is what will be directly given to discord.js to play in the voice channel so it must be either a url or a stream
exports.getStream = async (url) => {
    return youtubedl(url, ['-f bestaudio']); // Again, most probably youtube-dl
}

// This will be called whenever the bot needs information about a song given a url, most often when requesting a song from url
exports.getInfo = async (url) => {
    return new Promise((resolve, reject) => {
        resolve([{ // Array with the song info inside an object
            // In case of playlist just add elements to the array similar to this and they will be all added to the queue
            title, // The title of the song
            url, // The url of the song, this is what will be given to getInfo() to get information, to getStream() to play and generaly shown to the users when asking info about the song, ecc.
            author, // The author of the song
            authorUrl, // The url that redirects to user to the author page, optional (if not present will redirect to the song)
            thumbnail, // The thumbnail/cover of the song, optional
            duration, // The length in seconds of the song, optional but will be requested anyway if not present when playing so it's highly suggested to already give
        }]);

        reject({// use reject if there is any problem with the fetching of the info
            err,// this will be what will be logged when the error accurs, not required
            message,// use this to give the user info about the error, this should be human readable, not required
        }); 
    });
}

// This will be called to search for songs, querry is the search term(s), n is the number of results expected, should return as follows
exports.search = async (query, n) => {
    return new Promise((resolve, reject) => {
        resolve([{ // Array with all the results 
            title, // The title of the song
            url, // The url of the song, this is what will be given to getInfo() to get information, to getStream() to play and generaly shown to the users when asking info about the song, ecc.
            author, // The author of the song, optional
            authorUrl, // The url that redirects to user to the author page, optional (if not present will redirect to the song)
            thumbnail, // The thumbnail/cover of the song, optional
            duration, // The length in seconds of the song, optional but will be requested anyway if not present when playing so it's highly suggested to already give
        }]);

        reject({// use reject if there is any problem with the fetching of the search results
            err,// this will be what will be logged when the error accurs, not required
            message,// use this to give the user info about the error, this should be human readable, not required
        }); 
    });
}