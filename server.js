import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

import streamingData from "./data/streaming-data.json";

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Model
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

// Reset the database before adding the new info
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

// Middleware that checks if the database is connected before going forward to the endpoints
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// Routes
app.get("/", (req, res) => {
  res.send(
    "Movies per streaming platform: Netflix, Disney+, Hulu and Prime Video"
  );
});

// All movies
app.get("/movies", async (req, res) => {
  const movies = await Movie.find(req.query);

  res.json(movies);
});

// Movies by streaming platform. movies/streaming/?netflix=1 (change the streaming name for different platforms)
app.get("/movies/streaming", async (req, res) => {
  let streaming = await Movie.find(req.query);
  if (streaming) {
    if (req.query.netflix) {
      const netflixMovies = await Movie.find().gt("netflix", req.query.netflix);
      streaming = netflixMovies;
    } else if (req.query.hulu) {
      const huluMovies = await Movie.find().gt("hulu", req.query.hulu);
      streaming = huluMovies;
    } else if (req.query.prime_video) {
      const primeVideoMovies = await Movie.find().gt(
        "prime_video",
        req.query.prime_video
      );
      streaming = primeVideoMovies;
    } else if (req.query.disney) {
      const disneyMovies = await Movie.find().gt("disney", req.query.disney);
      streaming = disneyMovies;
    }
    res.json(streaming);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// Movie by id
app.get("/movies/id/:id", async (req, res) => {
  try {
    const movieById = await Movie.findById(req.params.id);
    if (movieById) {
      res.json(movieById);
    } else {
      res.status(404).json({ error: "No movie found with that id" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid Id" });
  }
});

// Movie by title
app.get("/movies/title/:title", async (req, res) => {
  try {
    const title = await Movie.findOne({ title: req.params.title });
    if (title) {
      res.json(title);
    } else {
      res.status(404).json({ error: "No movie found with that title" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid title" });
  }
});

// Movie by year
app.get("/movies/year/:year", async (req, res) => {
  try {
    const year = await Movie.find({ year: req.params.year });
    if (year) {
      res.json(year);
    } else {
      res.status(404).json({ error: "No movie found from the selected year" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid year" });
  }
});

// Movie by genre. The info typed in the url must the equal to the one on the json file (exemple: "Adventure,Drama") to be located.
app.get("/movies/genre/:genres", async (req, res) => {
  try {
    const genre = await Movie.find({ genres: req.params.genres });
    if (genre) {
      res.json(genre);
    } else {
      res.status(404).json({ error: "No movie found with that genre" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid genre" });
  }
});

app.get("/endpoints", (req, res) => {
  res.send(listEndpoints(app));
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
