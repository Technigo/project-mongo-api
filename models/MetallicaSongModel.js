// Importing the required module
import mongoose from "mongoose";

// Destructuring 'Schema' from mongoose
const { Schema } = mongoose

// Defining the schema for the Metallica song
export const songSchema = new Schema({
    spotify_id: { type: String, }, // Spotify ID of the song
    spotify_uri: { type: String }, // Spotify URI of the song
    album: { type: String }, // Album the song belongs to
    name: { type: String }, // Name of the song
    popularity: { type: Number }, // Popularity score of the song
    release_date: { type: String }, // Release date of the song
    track_number: { type: Number }, // Track number in the album
    danceability: { type: Number }, // Danceability metric of the song
    energy: { type: Number }, // Energy level of the song
    key: { type: Number }, // Musical key of the song
    loudness: { type: Number }, // Loudness of the song
    mode: { type: Number }, // Mode of the song
    speechiness: { type: Number }, // Speechiness of the song
    acousticness: { type: Number }, // Acousticness of the song
    instrumentalness: { type: Number }, // Instrumentalness of the song
    liveness: { type: Number }, // Liveness of the song
    valence: { type: Number }, // Valence score of the song
    tempo: { type: Number }, // Tempo of the song
    duration_ms: { type: Number }, // Duration of the song in milliseconds
    time_signature: { type: Number } // Time signature of the song
});

// Creating a Mongoose model based on the schema
export const MetallicaSongModel = mongoose.model("Song", songSchema);