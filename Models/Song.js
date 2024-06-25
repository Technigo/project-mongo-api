import mongoose from "mongoose"

// Schema - the blueprint

const { Schema } = mongoose

const musicSchema = new Schema({
  trackName: { type: String, required: true },

  artistName: { type: String, required: true },
  genre: { type: String, required: true },

  bpm: { type: Number, required: true },

  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number,
})
// The Model
export const Song = mongoose.model("Song", musicSchema)
