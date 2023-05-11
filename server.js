import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const Movie = mongoose.model('Movie', {
  title: String,
  show_id: Number,
  director: String,
  cast: String,
  country: String,
  release_year: Number,
  listed_in: String
});

// const tvShow = mongoose.model('tvShow', {
//   title: String,
//   show_id: Number,
//   director: String,
//   cast: String,
//   country: String,
//   release_year: Number,
//   listed_in: String
// });

  if (process.env.RESET_DB) {
    const seedDatabase = async () => {
      await Movie.deleteMany({})
      // await tvShow.deleteMany({})

      netflixData.forEach((movieData) => {
      new Movie(movieData).save();
      
      })
    }
    seedDatabase()
  }


// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Frida!");
});

// app.get('/movies', async (req, res) => {
//   const allMovies = await Movie.find({})
//   res.json(allMovies)
// }) RESET_DB

// app.get('/tvShows', async (req, res) => {
// const tvShows = await tvShow.find()
// res.json(tvShows)
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
