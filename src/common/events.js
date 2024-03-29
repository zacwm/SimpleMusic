// SimpleMusic Events

const { Client, Modules, moduleMetas } = require("../index");
const logs = require("./logs");

// Event Handler
const eventEmit = (event, args) => {
  if (event === "ready") {
    logs("ready", `Logged in as '${Client.user.tag}' (${Client.user.id})`);
    Client.application.commands.set(moduleMetas)
      .then(() => { logs("command", `Set ${moduleMetas.length} global command${moduleMetas.length !== 1 ? "s" : ""}.`); })
      .catch(console.error);
  }

  for (const module in Modules) {
    if (Modules[module][event]) Modules[module][event](...args);
  }
};

// Event Init
const events = [
  "ready",
  "warn",
  "error",
  "interactionCreate",
  "voiceStateUpdate",
];

events.forEach((event) => {
  Client.on(event, (...args) => {
    eventEmit(event, args);
  });
});