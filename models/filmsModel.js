const { default: mongoose } = require("mongoose");

const filmSchema = new mongoose.Schema({
  director: String,
  show_id: Number,
  title: String,
  country: String,
  cast: String,
  release_year: Number,
  description: String,
  cast: String,
  date_added: String,
  rating: String,
  duration: String,
  listed_in: String,
  type: String,
});

const Film = mongoose.model("films", filmSchema);

module.exports = Film;
