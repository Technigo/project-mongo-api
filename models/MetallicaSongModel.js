import mongoose from "mongoose";

const { Schema } = mongoose

export const songSchema = new Schema({
    spotify_id: { type: String, },
    spotify_uri: { type: String },
    album: { type: String },
    name: { type: String },
    popularity: { type: Number },
    release_date: { type: String },
    track_number: { type: Number },
    danceability: { type: Number },
    energy: { type: Number },
    key: { type: Number },
    loudness: { type: Number },
    mode: { type: Number },
    speechiness: { type: Number },
    acousticness: { type: Number },
    instrumentalness: { type: Number },
    liveness: { type: Number },
    valence: { type: Number },
    tempo: { type: Number },
    duration_ms: { type: Number },
    time_signature: { type: Number }
});

export const MetallicaSongModel = mongoose.model("Song", songSchema);