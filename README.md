# Project Top Music API
This project is a RESTful API for a database of top music. The API allows users to search for songs, artists, and song properties like genre and danceability. It was built using Node.js, Express, and MongoDB.

# The Problem
The main challenge of this project was designing an API that allows users to search for music by various parameters such as song ID, artist name, track name, genre, and danceability. The API provides several routes for these actions.

# Technologies used:
Node.js
Express
CORS
Mongoose
MongoDB

# MongoDB Schema:
A song in the database is defined with the following properties:

id: The song's identifier, a number.
trackName: The song's name, a string.
artistName: The artist's name, a string.
genre: The song's genre, a string.
bpm, energy, danceability, loudness, liveness, valence, length, acousticness, speechiness, popularity: Various characteristics of the song, all numbers.

# Endpoints:
/ - Index route listing all available endpoints
/songs - GET route to search for songs by genre and danceability
/songs/id/:id - GET route to search for a song by its MongoDB ID
/artists/:artistName - GET route to search for songs by an artist's name
/songs/:trackName - GET route to search for a song by its name

# How to run the API locally:
Clone the repository
Install dependencies with npm install
Make sure MongoDB is installed and running
If you want to reset and populate the database, set an environment variable RESET_DB to true. The database will be populated with data from data/top-music.json
Run the server with npm start
Access the API at http://localhost:8080

# API Deployed on Render:
https://project-mongo-api-y81i.onrender.com/