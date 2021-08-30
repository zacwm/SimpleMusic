const chalk = require("chalk");

const ColorCache = {};

module.exports = (title, message, colorOveride) => {
  // If colour overide is specified.
  if (colorOveride) title = chalk[colorOveride].bold(title.padStart(7));
  // If color exists.
  else if (ColorCache[title]) title = chalk[ColorCache[title]].bold(title.padStart(7));
  // Pick and cache new colour.
  else {
    const colorList = ["magenta", "cyan", "blue", "green"];
    const color = colorList[Math.floor(Math.random() * colorList.length)];
    ColorCache[title] = color;
    title = chalk[color].bold(title.padStart(7));
  }

  console.log(`${title}: ${message}`);
};