import mongoose from "mongoose";

// NetflixTitle-Schema to show what kind of data we want
const netflixTitleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  director: String,
  cast: String,
  country: {
    type: String,
  },
  date_added: {
    type: Date,
  },
  release_year: {
    type: Number,
    required: true,
  },
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: {
    type: String,
    required: true,
  },
});

// The Mongoose-model:
const NetflixTitle = mongoose.model("NetflixTitle", netflixTitleSchema);

export default NetflixTitle;
