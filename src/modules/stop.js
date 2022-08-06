// SimpleMusic Module

const { EmbedBuilder, InteractionType } = require("discord.js");
const config = require("../../config");
const { Player } = require("../index");

// Command
exports.meta = {
  name: "stop",
  description: "Stops the current playing song and deletes the queue.",
};

exports.interactionCreate = async (interaction) => {
  if (!interaction.type === InteractionType.ApplicationCommand || !interaction.guildId) return;
  if (interaction.commandName !== this.meta.name) return;
  if (config.commands.whitelist.enabled && !config.commands.whitelist.guilds[interaction.guildId]) {
    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("This server is not whitelisted in the config.")
          .setColor(config.commands.colors.error),
      ],
    });
  }
  const guildConfig = config.commands.whitelist.guilds[interaction.guildId];
  if (config.commands.whitelist.enabled && guildConfig.MusicAccess.length > 0 && interaction.member.roles.cache.find((role) => [...guildConfig.MusicAccess].includes(role.id)) === undefined) {
    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Sorry, but you don't have permission to use this command.")
          .setColor(config.commands.colors.error),
      ],
      ephemeral: true,
    });
  }

  if (!interaction.member.voice.channelId) {
    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("You're not in a voice channel.")
          .setColor(config.commands.colors.warn),
      ],
      ephemeral: true,
    });
  }
  if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
    return await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Sorry, I'm already playing for another voice channel.")
          .setColor(config.commands.colors.warn),
      ],
      ephemeral: true,
    });
  }

  await interaction.deferReply();
  const queueData = Player.getQueue(interaction.guild);
  if (queueData) {
    await queueData.stop();
    await Player.deleteQueue(interaction.guild);
    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setDescription("**Stopped the current playing song and deleted the queue.**")
          .setColor(config.commands.colors.ok),
      ],
    });
  } else {
    interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setDescription("There is no song playing to stop.")
          .setColor(config.commands.colors.warn),
      ],
    });
  }
};
