// SimpleMusic Module

const config = require("../../config");
const { EmbedBuilder, InteractionType } = require("discord.js");

// Command
exports.meta = {
  name: "ping",
  description: "Table tennis with clocks.",
};

exports.interactionCreate = (interaction) => {
  if (!interaction.type === InteractionType.ApplicationCommand || !interaction.guildId) return;
  if (interaction.commandName !== this.meta.name) return;

  const FirstTime = new Date();
  interaction.channel.send({
    embeds: [
      new EmbedBuilder()
        .setDescription("Pong! 🏓"),
    ],
  }).then((IM) => {
    const LastTime = new Date();
    IM.delete();
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`Pong! 🏓\nDelay: \`${LastTime - FirstTime} ms\``)
          .setColor(config.commands.colors.ok),
      ],
    });
  });
};
