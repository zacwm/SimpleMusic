# Commands
[required], (optional) | All commands start with the configured prefix in `config.js`.

### `!play (platform) [query|n]` / `!p [query|n]`
Will play or add to the queue the first search result from the query on the specified platform or YouTube if none is given. It also accepts direct URLs for supported platforms and alongside the `!search` command it allows to select from a list of search results.

### `!search (platform) [query]`
Will return search results for the specified query, on the specified platform or YouTube if none is given. Then the `!play [n]` command can be used to select which one of the results will be added to the queue/played.

### `!skip` / `!s`
Will skip the current playing song and play the next song in queue.

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
Used to check if the bot is responding.

### `!info`
Will give info about the bot.