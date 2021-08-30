// SimpleMusic Module

const { MessageEmbed } = require("discord.js");
const config = require("../../config");
const { Player, VoteSkips } = require("../index");

// Command
exports.meta = {
  name: "skip",
  description: "Skips the current playing song.",
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
  if (config.commands.whitelist.enabled && guildConfig.MusicAccess.length > 0 && interaction.member.roles.cache.find((role) => [guildConfig.MusicAccess].includes(role.id)) === undefined) {
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
    const doSkip = async () => {
      await queueData.skip();
      delete VoteSkips[interaction.guildId];
      interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setDescription("**Skipped...**")
            .setColor(config.commands.colors.ok),
        ],
      });
    };

    if (!VoteSkips[interaction.guildId]) VoteSkips[interaction.guildId] = new Map();
    if (VoteSkips[interaction.guildId].has(interaction.member.id)) {
      return interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setDescription("Your skip vote has already been placed.\n" +
            `${(typeof guildConfig.SkipVoting === "string") ? `At ${Math.floor((VoteSkips[interaction.guildId].size / queueData.connection.channel.members.size) * 100)}% of ${parseInt(guildConfig.SkipVoting)}% members in call required.` : ""}` +
            `${(typeof guildConfig.SkipVoting === "number" && guildConfig.SkipVoting > 0) ? `At ${VoteSkips[interaction.guildId].size} of ${guildConfig.SkipVoting} members required.` : ""}`)
            .setColor(config.commands.colors.error),
        ],
      });
    }

    if (guildConfig.SkipVoting === -1) {
      // Never skipping
      return interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setDescription("Skipping is disabled in this server.")
            .setColor(config.commands.colors.error),
        ],
      });
    } else if (guildConfig.SkipVoting === 0) {
      // Instant skipping
      return doSkip();
    } else if ((typeof guildConfig.SkipVoting === "string" && Math.floor((VoteSkips[interaction.guildId].size / queueData.connection.channel.members.size - 1) * 100) >= parseInt(guildConfig.SkipVoting)) || queueData.connection.channel.members.size === 2) {
      // Percentage skipping (reached)
      return doSkip();
    } else if (VoteSkips[interaction.guildId].size - 1 >= guildConfig.SkipVoting || queueData.connection.channel.members.size === 2) {
      // Specific skipping (reached)
      return doSkip();
    } else {
      // Skip requested
      VoteSkips[interaction.guildId].set(interaction.member.id);
      return interaction.followUp({
        embeds: [
          new MessageEmbed()
            .setDescription("Your skip vote has been placed.\n" +
              `${(typeof guildConfig.SkipVoting === "string") ? `At ${Math.floor((VoteSkips[interaction.guildId].size / queueData.connection.channel.members.size) * 100)}% of ${parseInt(guildConfig.SkipVoting)}% members in call required.` : ""}` +
              `${(typeof guildConfig.SkipVoting === "number" && guildConfig.SkipVoting > 0) ? `At ${VoteSkips[interaction.guildId].size} of ${guildConfig.SkipVoting} members required.` : ""}`)
            .setColor(config.commands.colors.ok),
        ],
      });
    }
  } else {
    interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setDescription("There is no song playing to skip.")
          .setColor(config.commands.colors.warn),
      ],
    });
  }
};