import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import netflixData from "./data/netflix-titles.json";
import { resolveShowConfigPath } from "@babel/core/lib/config/files";

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

// Get all the movies
app.get("/movies", async (req, res) => {
  const movies = await Movie.find({});
  res.json(movies);
});

// Get one movie with filter
app.get("/movies/title/:title", async (req, res) => {
  try {
    const movieByTitle = await Movie.findOne(req.params.title);
    if (movieByTitle) {
      res.json(movieByTitle);
    } else {
      res.status(404).json({ error: "Couln't find a movie with that title.." });
    }
  } catch (err) {
    res.status(404).json({ error: "ERROR!!" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
