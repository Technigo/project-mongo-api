import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  show_id: { type: Number, unique: true },
  title: { type: String, trim: true },
  director: { type: String, trim: true },
  cast: { type: String, trim: true },
  country: { type: String, trim: true },
  date: { type: String, trim: true },
  release_year: Number,
  rating: { type: String, trim: true },
  duration: { type: String, trim: true },
  listed_in: { type: String, trim: true },
  description: { type: String, trim: true },
  type: { type: String, trim: true }
});

module.exports = new mongoose.model('Show', showSchema);
