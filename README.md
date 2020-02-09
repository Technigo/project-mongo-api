# Mongo API Project
A RESTful API for top music built with Express and using Mongoose models and MongoDB.
The API has different routes for tracks and artists and some filtering options.

## The problem
The data is taken from a JSON file that contains data about 50 top tracks from Spotify. I began with planning what data I wanted to include from the JSON file and what routes I would create.

After that I built a model with Mongoose and a seeding function to populate the database.

I created and tested each route, added queries to tracks, and error messages for when track or artist isn't found.

## View it live

[Start route](https://mongo-top-music.herokuapp.com/)

[Tracks route](https://mongo-top-music.herokuapp.com/tracks?genre=pop&bpm=117) –  displays all tracks or tracks filtered by genre and/or bpm. Queries: genre, bpm.

[Track single result route](https://mongo-top-music.herokuapp.com/tracks/5e400d8aa1f71c00231cf997) – single result for a track, takes track id as a parameter.

[Artists route](https://mongo-top-music.herokuapp.com/artists) – all artists and tracks.

[Artist tracks route](https://mongo-top-music.herokuapp.com/artists/Ed%20Sheeran/tracks) – displays all tracks by a specific artist, takes an artist name as a parameter.
