import mongoose from "mongoose";

const { Schema, model } = mongoose;

const movieSchema = new Schema({
  show_id: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
  },
  director: {
    type: String,
  },
  country: {
    type: String,
    //required: true,
    default: "Unknown",
  },
  date_added: {
    type: Date, // Store as a JavaScript Date object
    // convert to a different date format/ human readable. i coudn´t find an aproach to do so...
  },
  release_year: {
    type: Number,
    //required: true,
  },
  duration: {
    type: String,
  },
  listed_in: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
});

const Movie = model("Movie", movieSchema);

export default Movie;
