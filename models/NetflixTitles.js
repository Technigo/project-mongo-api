import mongoose from "mongoose";

const { Schema, model } = mongoose;
const NetflixTitleSchema = new Schema({
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: Date,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  duration: String,
  type: String,
});

const NetflixTitle = model("NetflixTitle", NetflixTitleSchema);

export default NetflixTitle;