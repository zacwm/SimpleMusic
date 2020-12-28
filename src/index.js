// SimpleMusic ~ Zachary (@zacimac)
// A simple & configurable Discord.js music bot!
const Discord = require("discord.js");
const client = new Discord.Client();
const chalk = require("chalk");
const fs = require("fs");
const config = require("./config");
const { mainModule } = require("process");

client.login(config.credentials.discord);

var commands = {};

// Exports
exports.command = defineCommand;
exports.commands = commands;
exports.client = client;
exports.log = log;

// Load commands
function defineCommand(command, callback) {
    command.forEach(alias => { commands[alias] = callback; });
};

fs.readdirSync("./commands").forEach(command => {
    if (command.endsWith('.js')) {
        log("command", `Loaded ${command}`);
        require(`./commands/${command}`);
    }
});

// Logs lmao
function log(type, message) {
    switch(type) {
        case "command":
            type = chalk.magenta.bold("command".padStart(7, " "))
            break;
        case "source":
            type = chalk.cyan.bold("music".padStart(7, " "));
            break;
        case "bot":
            type = chalk.blue.bold("bot".padStart(7, " "));
            break;
        case "music":
            type = chalk.green.bold("music".padStart(7, " "));
            break;
        case "error":
            type = chalk.red.bold("ERROR".padStart(7, " "));
            break;
        default:
            type = type.padStart(7, " ");
    }
    console.log(`${type} > ${message}`);
}