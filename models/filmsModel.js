const { default: mongoose } = require("mongoose");

const filmSchema = new mongoose.Schema({
  director: { type: String },
  show_id: { type: Number },
  title: { type: String, require: [true, "A film must has a title"] },
  country: { type: String },
  cast: { type: String },
  release_year: { type: Number },
  description: { type: String },
  date_added: { type: String, default: new Date() },
  rating: { type: String },
  duration: { type: String },
  listed_in: { type: String },
  type: {
    type: String,
    enum: {
      values: ["Movie", "TV Show"],
      message: "Type is either : Movie or TV Show",
    },
  },
});

const Film = mongoose.model("films", filmSchema);

module.exports = Film;
