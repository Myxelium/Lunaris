# Discord Music Bot - In Progress

This is a simple Discord bot that allows users to play music from various sources (e.g. YouTube, Spotify, SoundCloud) in a voice channel.

## Features

- Play music from YouTube, Spotify, SoundCloud, etc. in a voice channel
- Add songs to a queue to be played in order
- Skip the currently playing song

## Commands

- `/play [input]`: Plays the requested song in the voice channel. The `input` argument can be a URL or search query for a song on YouTube, Spotify, SoundCloud, etc.
- `/queue [song]`: Adds the requested song to the music queue. The `song` argument can be a URL or search query for a song on YouTube, Spotify, SoundCloud, etc.

## Setup

1. Clone this repository and install the dependencies by running `npm install`.
2. Create a `.env` file in the root directory of the project and add your bot token as an environment variable named `TOKEN`.
3. Run the bot by running `node index.js`.
