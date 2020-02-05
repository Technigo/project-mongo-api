import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  title: String,
  director: String,
  cast: String,
  country: String,
  date: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
});

module.exports = new mongoose.model('Show', showSchema);
