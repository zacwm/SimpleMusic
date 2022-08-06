// SimpleMusic Module

const { QueueRepeatMode } = require("discord-player");
const { EmbedBuilder, EmbedFooterData, InteractionType, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../config");
const { Player } = require("../index");

// Command
exports.meta = {
  name: "queue",
  description: "Music queue manager commands",
  options: [
    {
      name: "list",
      description: "List all upcomming songs in the queue.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "page",
          type: ApplicationCommandOptionType.Integer,
          description: "The page of queue items to show.",
          required: false,
        },
      ],
    },
    {
      name: "delete",
      description: "Deletes a item from the queue",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "item",
          type: ApplicationCommandOptionType.Integer,
          description: "The items position number in the queue to remove.",
          required: true,
        },
      ],
    },
  ],
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

  if (interaction.options.getSubcommand() === "list") {
    const queueData = Player.getQueue(interaction.guild);
    if (queueData?.tracks && queueData?.tracks.length > 0) {
      const arrayChunks = Array(Math.ceil(queueData.tracks.length / 10)).fill().map((_, index) => index * 10).map((begin) => queueData.tracks.slice(begin, begin + 10));
      const pageNumber = interaction.options.get("page") ? interaction.options.get("page").value - 1 : 0;
      if (pageNumber < 0 && arrayChunks.length < pageNumber) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("That page number doesn't exist.")
              .setColor(config.commands.colors.warn),
          ],
        });
      }
      const currentTrack = await queueData.nowPlaying();
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Queue for #${queueData.connection.channel.name}${queueData.repeatMode === QueueRepeatMode.QUEUE ? "| 🔁" : ""}`)
            .setDescription(((currentTrack && pageNumber === 0) ? `*Currently:* **[${currentTrack.title}](${currentTrack.url})** | Requested by: <@${currentTrack.requestedBy.id}>\n` : "") + arrayChunks[pageNumber].map((track, index) => `*${(pageNumber * 10) + (index + 1)}:* **[${track.title}](${track.url})** | Requested by: <@${track.requestedBy.id}>`).join("\n"))
            .setFooter({text:`${queueData.tracks.length} song${queueData.tracks.length !== 1 ? "s" : ""} in queue • Page ${pageNumber + 1} of ${arrayChunks.length}`, iconURL: null})
            .setColor(config.commands.colors.ok),
        ],
        ephemeral: true,
      });
    } else if (queueData?.playing) {
      const currentTrack = await queueData.nowPlaying();
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Queue for #${queueData.connection.channel.name}`)
            .setDescription(`*Now:* **[${currentTrack.title}](${currentTrack.url})** | Requested by: <@${currentTrack.requestedBy.id}>`)
            .setFooter({text: queueData.repeatMode === QueueRepeatMode.QUEUE ? `* Queue is looping!` : null, iconURL: null})
            .setColor(config.commands.colors.ok),
        ],
      });
    } else {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("The queue is empty.")
            .setColor(config.commands.colors.ok),
        ],
      });
    }
  }

  if (interaction.options.getSubcommand() === "delete") {
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
    const queueData = Player.getQueue(interaction.guild);
    const posNumber = interaction.options.get("item").value;
    if (queueData?.tracks && queueData?.tracks.length > 0) {
      if (posNumber > 0 && posNumber <= queueData.tracks.length) {
        const track = queueData.tracks[posNumber - 1];
        queueData.remove(posNumber - 1);
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`Removed [${track.title}](${track.url}) from the queue.`)
              .setColor(config.commands.colors.ok),
          ],
        });
      } else {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("That queue position is not in our queue range.")
              .setColor(config.commands.colors.warn),
          ],
          ephemeral: true,
        });
      }
    } else {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Queue is empty.")
            .setColor(config.commands.colors.ok),
        ],
      });
    }
  }
};
