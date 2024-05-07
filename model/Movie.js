import mongoose from "mongoose";

const { Schema, model } = mongoose;

const movieSchema = new Schema({
  show_id: {
    type: Number,
    required: true,
    unique: true, // Ensures no duplictae show IDs
  },
  title: {
    type: String,
    required: true,
  },
  director: {
    type: String,
  },
  cast: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
  date_added: {
    type: Date, // Store as a JavaScript Date object
    required: true,
  },
  release_year: {
    type: Number,
    required: true,
  },
  rating: {
    type: String,
  },
  duration: {
    type: String,
  },
  listed_in: {
    type: String,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
});

const Movie = model("Movie", movieSchema);

export default Movie;
