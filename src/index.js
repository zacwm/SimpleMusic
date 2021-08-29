// SimpleMusic | https://github.com/zacimac/SimpleMusic
// A simple & configurable Discord.js music bot!

const { Client, Intents } = require("discord.js");
const logs = require("./common/logs");
const fs = require("fs");
const path = require("path");
const config = require("../config");

// Exports
exports.moduleMetas = [];
exports.Modules = {};
exports.Client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

// Load Modules
fs.readdirSync(path.join(__dirname, "./modules")).forEach((file) => {
  try {
    if (!file.endsWith(".js")) return;
    this.Modules[file] = require(path.join(__dirname, "./modules", file));
    if (this.Modules[file].meta) this.moduleMetas.push(this.Modules[file].meta);
  } catch (err) {
    logs("error", `Error thrown trying to load module '${file}'`);
    console.error(err);
  }
});

require("./common/events");
this.Client.login(config.credentials.discord);