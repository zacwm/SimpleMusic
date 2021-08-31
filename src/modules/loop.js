// SimpleMusic Module

const { MessageEmbed } = require("discord.js");
const config = require("../../config");
const { Player } = require("../index");
const { QueueRepeatMode } = require("discord-player");

// Command
exports.meta = {
  name: "loop",
  description: "Toggle queue looping.",
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
  const guildConfig = config.commands.whitelist.guilds[interaction.guildId];
  if (config.commands.whitelist.enabled && guildConfig.MusicAccess.length > 0 && interaction.member.roles.cache.find((role) => [...guildConfig.MusicAccess].includes(role.id)) === undefined) {
    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription("Sorry, but you don't have permission to use this command.")
          .setColor(config.commands.colors.error),
      ],
      ephemeral: true,
    });
  }

  if (!interaction.member.voice.channelId) {
    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription("You're not in a voice channel.")
          .setColor(config.commands.colors.warn),
      ],
      ephemeral: true,
    });
  }
  if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription("Sorry, I'm already playing for another voice channel.")
          .setColor(config.commands.colors.warn),
      ],
      ephemeral: true,
    });
  }

  await interaction.deferReply();
  const queueData = Player.getQueue(interaction.guild);
  if (queueData?.playing) {
    if (queueData.repeatMode !== QueueRepeatMode.OFF) {
      await queueData.setRepeatMode(QueueRepeatMode.OFF);
      interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setDescription("Queue looping has been turned **off**.")
            .setColor(config.commands.colors.ok),
        ],
      });
    } else {
      await queueData.setRepeatMode(QueueRepeatMode.QUEUE);
      interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setDescription("Queue looping has been turned **on**.")
            .setColor(config.commands.colors.ok),
        ],
      });
    }
  } else {
    interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setDescription("A song must be playing first.")
          .setColor(config.commands.colors.warn),
      ],
    });
  }
};