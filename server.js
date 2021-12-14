import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Movie = mongoose.model("Movie", {
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

// const newMovie = new Movie({
//   title: "The Zoya Factor",
//   release_year: 2019,
//   director: "Abhishek Sharma",
// });

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Movie.deleteMany({});

    netflixData.forEach(item => {
      const newMovie = new Movie(item);
      newMovie.save();
    });
  };

  seedDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
