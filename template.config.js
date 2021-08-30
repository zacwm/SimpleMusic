// SimpleMusic v2 Config

module.exports = {
  // Token = A Discord token used to login to Discord. | Obtainable from the Discord Developer Portal.
  token: "",

  commands: {
    // Colours = The colours to display on the embed messages depending on the response type.
    colors: {
      ok: "0x9b59b6",
      warn: "0xf39c12",
      error: "0xe74c3c",
    },

    // Whitelist = If enabled, it will only allow the specified guilds.
    whitelist: {
      enabled: true,
      guilds: {
        "669869390287863850": {
          // ## Music Access = If not blank, only the roles listed (by ID) can use music changing (play, skip, leave, queue editing) commands.
          // Example usage: ["123456789", "0987654321"]
          MusicAccess: [],

          // ## Skip Votes = Requires a number of members to vote to skip before skipping.
          // Percentage of listeners = Use a string. Example: "50"
          // Number of listeners = Specify a number of members before skipping. Example: 5
          // Instant = Set to 0
          // Never = Set to -1
          SkipVoting: 0,
        },
      },
    },
  },
};