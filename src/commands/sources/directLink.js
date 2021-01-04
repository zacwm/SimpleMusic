// SimpleMusic - Source
exports.alias = ['directlink', 'direct', 'link', 'dl'];

exports.url = /((https?|ftp):((\/\/)|(\\\\))+[\w\d:#@%/;$()~_?\+-=\\\.&]*\.(mp3|mp4|m4a|wav))/i;

exports.getStream = async (url) => {
    return url;
}

exports.getInfo = async (url) => {
    return new Promise((resolve) => {resolve([{
            title: "Direct Link",
            url: url,
            duration: 0,
        }]);});
}

exports.search = async (query, n) => {
    return new Promise((resolve) => {resolve([{
        title: "Direct Link",
        url: query,
        duration: 0,
    }]);});
}