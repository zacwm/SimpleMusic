// SimpleMusic Module

const config = require("../../config");
const { EmbedBuilder, InteractionType } = require("discord.js");

// Command
exports.meta = {
  name: "help",
  description: "Provides helpful information about this bot.",
};

exports.interactionCreate = (interaction) => {
  if (!interaction.type === InteractionType.ApplicationCommand || !interaction.guildId) return;
  if (interaction.commandName !== this.meta.name) return;

  interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("Hey! 👋")
        .setDescription(
          "❤️ Thanks for using [SimpleMusic v2](https://github.com/zacimac/SimpleMusic)\n" +
          "For a list of commands [click here](https://github.com/zacimac/SimpleMusic/blob/main/COMMANDS.md)\n" +
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
