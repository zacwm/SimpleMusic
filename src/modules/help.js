// SimpleMusic Module

const config = require("../../config");
const { MessageEmbed } = require("discord.js");

// Command
exports.meta = {
  name: "help",
  description: "Provides helpful information about this bot.",
};

exports.interactionCreate = (interaction) => {
  if (!interaction.isCommand() || !interaction.guildId) return;
  if (interaction.commandName !== this.meta.name) return;

  interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Hey! 👋")
        .setDescription(
          "❤️ Thanks for using [SimpleMusic v2](https://github.com/zacimac/SimpleMusic)\n" +
          "For a list of commands [click here](https://github.com/zacimac/SimpleMusic/COMMANDS.md)\n" +
          "🌟 Also be sure to star this repo on GitHub!",
        )
        .setFields([
          {
            name: "Developers",
            value: "[Zachary](https://github.com/zacimac)\n" +
              "[Enrico](https://github.com/Leone25)",
            inline: true,
          },
          {
            name: "Sponsors",
            value: "[elybeatmaker](https://github.com/elybeatmaker)\n" +
              "[Filyx20](https://github.com/Filyx20)",
            inline: true,
          },
        ])
        .setColor(config.commands.colors.ok),
    ],
  });
};