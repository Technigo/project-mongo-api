import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

import netflixData from "./data/netflix-titles.json";
import Movie from "./model/Movie.js";

// Load environment variables
dotenv.config();

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";

//Connect to MongoDB
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

if (process.env.RESET_DB) {
  const seedDatabased = async () => {
    await Movie.deleteMany({});

    netflixData.forEach((movieData) => {
      new Movie(movieData).save();
    });
  };

  seedDatabased();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  try {
    //throw new Error("Simulated error"); //testing error

    res.json({
      message: "Welcome to Netflix Mongo API",
      endpoints: listEndpoints(app),
    });
  } catch (error) {
    res.status(500).json({
      error: "An unexpected error ocured",
      details: error.message,
    });
  }
});

// Route to get all items
//http://localhost:8000/netflix
app.get("/netflix", async (req, res) => {
  const allMovies = await Movie.find();

  if (allMovies.length > 0) {
    res.json(allMovies);
  } else {
    res.status(400).send("Error fetching Netflix movie list");
  }
});

// Route to get items by type
//http://localhost:8000/movies/
app.get("/movies", async (req, res) => {
  const movies = await Movie.find({ type: "Movie" });

  if (movies.length > 0) {
    res.json(movies);
  } else {
    res.status(404).send("Error fetching movies");
  }
});

//http://localhost:8000/tvshows/
app.get("/tvshows", async (req, res) => {
  const tvShows = await Movie.find({ type: "TV Show" });

  if (tvShows.length > 0) {
    res.json(tvShows);
  } else {
    res.status(500).send("Error retrieving TV Shows");
  }
});

// route to get a single result
//http://localhost:8000/movie?title=Chip and Potato
//http://localhost:8000/movie?director=Mandla Dube
app.get("/movie", async (req, res) => {
  const { title, director } = req.query;

  const filter = {};
  if (title) {
    filter.title = title;
  }

  if (director) {
    filter.director = director;
  }

  try {
    const movie = await Movie.findOne(filter); // Find a single movie

    if (!movie) {
      return res.status(404).send({
        error: "Content not avaiable",
        message: "No matching content found for the given criteria",
      });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).send("An error occurred while fetching the movie");
  }
});

// Custom 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The requested route ${req.originalUrl} does not exist.`,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
