// SimpleMusic Module

const { MessageEmbed } = require("discord.js");

// Command
exports.meta = {
  name: "ping",
  description: "Table tennis with clocks.",
};

exports.interactionCreate = (interaction) => {
  if (!interaction.isCommand() || !interaction.guildId) return;
  if (interaction.commandName !== this.meta.name) return;
  const FirstTime = new Date();
  interaction.channel.send({
    embeds: [
      new MessageEmbed()
        .setDescription("Pong! 🏓"),
    ],
  }).then((IM) => {
    const LastTime = new Date();
    IM.delete();
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription(`Pong! 🏓\nDelay: \`${LastTime - FirstTime} ms\``),
      ],
    });
  });
};