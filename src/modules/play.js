// SimpleMusic Module

const { MessageEmbed } = require("discord.js");
const config = require("../../config");
const { Player } = require("../index");
const { QueryType } = require("discord-player");

// Command
exports.meta = {
  name: "play",
  description: "Plays a song in a voice channel.",
  options: [
    {
      name: "song",
      type: "STRING",
      description: "A search term or a YouTube/SoundCloud/Spotify URL.",
      required: true,
    },
  ],
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
          .setDescription("You need to be in a voice channel first.")
          .setColor(config.commands.colors.warn),
      ],
      ephemeral: true,
    });
  }
  if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
    return await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription("Sorry, I'm already playing music for another voice channel.")
          .setColor(config.commands.colors.warn),
      ],
      ephemeral: true,
    });
  }

  const query = interaction.options.get("song").value;
  const queue = Player.createQueue(interaction.guild, {
    metadata: {
      channel: interaction.channel,
    },
  });

  try {
    if (!queue.connection) await queue.connect(interaction.member.voice.channel);
  } catch {
    queue.destroy();
    return await interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setDescription("Failed to join voice channel!")
          .setColor(config.commands.colors.error),
      ],
    });
  }

  await interaction.deferReply({ ephemeral: true });
  const searchResults = await Player
    .search(query, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    })
    .catch(console.error);
  if (!searchResults || !searchResults.tracks.length) {
    return await interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setDescription(`No results or valid length of songs were found when searching for \`${query}\``)
          .setColor(config.commands.colors.warn),
      ],
    });
  }

  if (searchResults.playlist) {
    queue.addTracks(searchResults.tracks);
    await interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setDescription(`Added **${searchResults.tracks.length} song${searchResults.tracks.length !== 1 ? "s" : ""}** to the queue!\n*via ${searchResults.tracks[0].source}*`)
          .setThumbnail(searchResults.thumbnail)
          .setColor(config.commands.colors.ok),
      ],
    });
  } else {
    const song = searchResults.tracks[0];
    queue.addTrack(song);
    await interaction.followUp({
      embeds: [
        new MessageEmbed()
          .setDescription(`Added to queue!\n[${song.title}](${song.url})\n*via ${song.source}*`)
          .setThumbnail(song.thumbnail)
          .setColor(config.commands.colors.ok),
      ],
    });
  }

  if (!queue.playing) queue.play();
};