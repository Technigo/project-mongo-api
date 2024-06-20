import mongoose from "mongoose"

// Schema - the blueprint

const { Schema } = mongoose

const musicSchema = new Schema({
  trackName: { type: String },

  artistName: { String },
  genre: { String },

  bpm: { Number },

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
const Song = mongoose.model("Song", musicSchema)

export default Song
