# SimpleMusic
*I didn't have a better name...*<br />
A simple & *kinda configurable* Discord.js music bot!

## Commands
[required], (optional) | All commands start with the configued prefix in `config.js`.

### `!play [query]` / `!p [query]`
Will queue the query or play immediately if it is the first song in the queue. A query can be a search term and will grab the first result or a YouTube video URL or a SoundCloud URL.

### `!skip` / `!s`
Will skip the current playing song for the next song in queue.

### `!delete [n|last]`
Will delete from the queue the song in the `n` position or the last one if `last` is given as an argument.

### `!playing` / `!nowplaying` / `!np` / `!current` / `!now`
Will return with information such as the time played, song length, what channel it is playing in and who requested it for the current playing song.

### `!queue (page number)` / `!q (page number)`
Will list the upcoming queued songs for the voice channel. If there is more than 10, a page number can be specified to list more.

### `!loop`
Will toggle loop.

### `!stop` / `!leave` / `!disconnect`
Will disconnect from the voice channel and remove all songs from the queue.

### `!ping`
Used to check if the bot is responding...

## Installing
1. Clone and navigate to the directory in terminal
2. Ensure Node.js v14.0.0 or newer is installed by using `node -v`
3. Install required packages by using `npm i`
4. Rename `template.config.js` to `config.js` located in the `/src` folder, then open and follow steps inside.
5. Run `npm start` to start the bot.
7. Have a party! :)