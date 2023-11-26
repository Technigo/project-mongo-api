// Import necessary modules.
import mongoose from "mongoose";

// Destructure Schema from mongoose.
const { Schema } = mongoose;

// Define the schema for Netflix shows.
export const netflixShowSchema = new Schema({
  show_id: { type: Number },
  title: { type: String },
  director: { type: String },
  cast: { type: String },
  country: { type: String },
  date_added: { type: String },
  release_year: { type: Number },
  rating: { type: String },
  duration: { type: String },
  listed_in: { type: String },
  description: { type: String },
  type: { type: String },
});

// Create a Mongoose model for Netflix shows.
export const NetflixShowModel = mongoose.model(
  "netflix-shows",
  netflixShowSchema
);
