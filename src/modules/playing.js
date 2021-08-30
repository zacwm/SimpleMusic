// SimpleMusic Module

const { MessageEmbed } = require("discord.js");
const config = require("../../config");
const { Player } = require("../index");

// Command
exports.meta = {
  name: "playing",
  description: "Displays the current playing song.",
};

exports.interactionCreate = async (interaction) => {
  if (!interaction.isCommand() || !interaction.guildId) return;
  if (interaction.commandName !== this.meta.name) return;
  if (config.commands.whitelist.enabled && !config.commands.whitelist.guilds[interaction.guildId]) {
    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription("This server is not whitelisted in the config.")
          .setColor(config.commands.colors.error),
      ],
    });
  }

  await interaction.deferReply();
  const queueData = Player.getQueue(interaction.guild);
  if (queueData?.playing) {
    const currentTrack = await queueData.nowPlaying();
    const currentTimestamp = await queueData.getPlayerTimestamp();
    const progBar = await queueData.createProgressBar({
      timecodes: false,
      queue: false,
      length: 15,
      line: "―",
      indicator: "•",
    });
    interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setTitle(`**${currentTrack.title}**`)
          .setURL(currentTrack.url)
          .setThumbnail(currentTrack.thumbnail)
          .setDescription(`${currentTimestamp.current} ${progBar} ${currentTimestamp.end}\nRequested by: <@${currentTrack.requestedBy.id}> | Playing in: <#${queueData.connection.channel.id}>`)
          .setColor(config.commands.colors.ok),
      ],
    });
  } else {
    interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setDescription("There is no song playing.")
          .setColor(config.commands.colors.warn),
      ],
    });
  }
};