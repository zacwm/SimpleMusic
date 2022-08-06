// SimpleMusic | https://github.com/zacimac/SimpleMusic
// A simple & configurable Discord.js music bot!

const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const logs = require("./common/logs");
const fs = require("fs");
const path = require("path");
const config = require("../config");
const { Player } = require("discord-player");

// Exports
exports.moduleMetas = [];
exports.Modules = {};
exports.VoteSkips = {};
exports.Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ],
});
exports.Player = new Player(this.Client, config.discordPlayerOptions);

this.Player.on("trackStart", (queue, track) => {
  queue.metadata.channel.send({
    embeds: [
      new EmbedBuilder()
        .setDescription(`Now playing **[${track.title}](${track.url})**\nRequested by: <@${track.requestedBy.id}>`)
        .setThumbnail(track.thumbnail)
        .setColor(config.commands.colors.ok),
    ],
  });
});

this.Player.on("queueEnd", (queue) => {
  queue.metadata.channel.send({
    embeds: [
      new EmbedBuilder()
        .setDescription(`Finished the queue in <#${queue.connection.channel.id}>`)
        .setColor(config.commands.colors.ok),
    ],
  });
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
this.Client.login(config.token);
