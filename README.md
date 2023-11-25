# Project Mongo API

My first API using mongoDB. It consists of 50 popular music tracks from Spotify.

## The problem

I begun by setting up the API with three basic endpoints: all songs, a particular song and all songs from a certain artist.
I deployed the backend to Render and the database to Atlas.

Once the debugging of the deployment was complete I decided to add a front end and look into more create endpoints.

I have read plenty on StackOverflow, W3school, geeksforgeeks and watched youtube. As well as looking at Atlas, Postman and Compass.

If I had more time I would add post/put/delete-methods as well

## View it live

https://mongo-api-frida.onrender.com/

## Endpoints

### /songs

All songs from the folder, with a pagination which defaults to 10 songs per page. These are set by queries, just add ?limit=5&page=8 with arbitrary values to move between the pages.

### /songs/:songId

A certain song found by its id. The id is found as the songs "\_id"

### /artists

A list of all artists with song(s) in the API

### /artists/:artist

Returns all songs by an artist. Ed will return Ed Sheeran as well as MEDUZA because they both contain "ed"

### /genres/:specificGenre

Returns all songs of a particular genre

### /danceable

Returns all songs with a danceability-score over 70

### /songs-of-joy

Returns all songs with a bmp > 100, energy > 50 and danceability > 50. They are sorted by popularity.
