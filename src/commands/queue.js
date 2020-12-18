// SimpleMusic - Command
const sm = require("../index");

sm.command(["queue", "q"], (msg) => {
    let queue = (sm.data[msg.guild.id]) ? sm.data[msg.guild.id].queue : [];
    if (queue.length > 0) {
        var pageNum = (msg.args[1] !== undefined && /\d+/.test(msg.args[1])) ? (parseInt(msg.args[1]) - 1) : 0;
        var pageData = [];
        sm.data[msg.guild.id].queue.forEach((song, index) => {
            pageData.push(`**${index + 1})** [${song.title}](https://www.youtube.com/watch?v=${song.id}}) | <@${song.requester}>`);
        });
        var queuePages = Array(Math.ceil(pageData.length / 10)).fill().map((_, index) => index * 10).map(begin => pageData.slice(begin, begin + 10));
        if (pageNum > -1 && queuePages.length > pageNum) {
            msg.channel.send("", { embed: {
                color: msg.colors.ok,
                title: `In queue: ${pageData.length} song${(pageData.length !== 1)?"s":""} | Loop is ${(sm.data[msg.guild.id].loop ? "on" : "off")} | Page: ${pageNum + 1}/${queuePages.length}`,
                description: `${queuePages[pageNum].join("\n")}`,
                footer: { text: (queuePages.length > 1) ? `'${config.commands.prefix}queue [number]' to view more pages` : undefined }
            }});
        } else {
            msg.channel.send("", { embed: {
                color: msg.colors.error,
                description: `Page out of range.`
            }});
        }

        /*
        glitch.extras.pages(pageData, {size: 10, page: pageNum}, function(err, result) {
            if (err) {
                msg.channel.send("", { embed: {
                    color: (err.type == "OoR") ? glitch.config.commands.colors.warn : glitch.config.commands.colors.error,
                    description: `${(err.type == "OoR") ? `Page must be between 1 - ${err.value}` : "Something happened!!"}`,
                }});
            } else {
                msg.channel.send("", { embed: {
                    color: glitch.config.commands.colors.ok,
                    title: `${msg.language("music.queue.queuelist.inqueue")}: ${pageData.length} song${(pageData.length !== 1)?"s":""} | Page: ${pageNum + 1}/${result.totalPages}`,
                    description: `${result.arr.join("\n")}`,
                    footer: {
                        text: msg.language("music.queue.queuelist.pagetip", [msg.author])
                    }
                }});
            }
        });*/
    } else {
        msg.channel.send("", {embed: {
            color: msg.colors.warn,
            description: "The queue is empty."
        }}); 
    }
});