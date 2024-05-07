import cors from "cors";
import express from "express";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";

import netflixData from "./data/netflix-titles.json";
import Movie from "./model/Movie.js";

// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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
  res.send("Hello Technigo!");
});

app.get("/movies", async (req, res) => {
  const allMovies = await Movie.find();

  if (allMovies.length > 0) {
    res.json(allMovies);
  } else {
    res.status(404).send("No movie was found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
