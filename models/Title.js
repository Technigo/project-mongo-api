import mongoose from "mongoose";

const { Schema } = mongoose;

export const titleSchema = new Schema({
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String,
});

export const Title = mongoose.model("Title", titleSchema);
