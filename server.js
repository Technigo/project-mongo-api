import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import streamingData from "./data/streaming-data.json";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Movie = mongoose.model("Movie", {
  index: Number,
  id: Number,
  title: String,
  year: Number,
  age: String,
  imdb: String,
  rotten_tomatoes: String,
  netflix: Number,
  hulu: Number,
  prime_video: Number,
  disney: Number,
  type: Number,
  directors: String,
  genres: String,
  country: String,
  language: String,
  runtime: Number,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Movie.deleteMany();

    streamingData.forEach((item) => {
      const newMovie = new Movie(item);
      newMovie.save();
    });
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(
    "Movies per streaming platform: Netflix, Disney+, Hulu and Prime Video"
  );
});

app.get("/movies", async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

app.get("/movies/id/:id", async (req, res) => {
  try {
    const movieById = await Movie.findById(req.params.id);
    if (movieById) {
      res.json(movieById);
    } else {
      res
        .status(404)
        .json({ error: "No movie was found with the id provided" });
    }
  } catch (err) {
    res.status(400).json({ error: "ERROR" });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
