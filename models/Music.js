import mongoose from "mongoose";

// Defines a Mongoose schema for the "Music" collection
const MusicSchema = new mongoose.Schema({
  trackName: { type: String, required: true },
  artistName: { type: String, required: true },
  genre: String,
  bpm: Number,
  popularity: Number,
});

export default mongoose.model("Music", MusicSchema);
