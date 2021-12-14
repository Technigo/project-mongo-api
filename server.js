import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import data from "./data/netflix-titles.json";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/movies";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Media = mongoose.model("Media", {
  id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  dateAdded: String,
  releaseYear: Number,
  rating: String,
  duration: String,
  categories: String,
  description: String,
  type: String,
});

// "show_id": 81094391,
// "title": "Sugar Rush Christmas",
// "director": "",
// "cast": "Hunter March, Candace Nelson, Adriano Zumbo",
// "country": "United States",
// "date_added": "November 29, 2019",
// "release_year": 2019,
// "rating": "TV-PG",
// "duration": "1 Season",
// "listed_in": "Reality TV",
// "description": "It's everything you love about \"Sugar Rush\" – with a holly jolly holiday twist – in this Christmas-themed spin on competitive baking.",
// "type": "TV Show"

if (process.env.RESET_DATABASE) {
  console.log("Resetting database!");
  const seedDatabase = async () => {
    await Media.deleteMany();

    const netflixList = data.map((media) => {
      return {
        id: media.show_id,
        title: media.title,
        director: media.director,
        cast: media.cast,
        country: media.country,
        dateAdded: media.date_added,
        releaseYear: media.release_year,
        rating: media.rating,
        duration: media.duration,
        categories: media.listed_in,
        description: media.description,
        type: media.type,
      };
    });

    netflixList.forEach(async (media) => {
      const newMedia = new Media(media);
      await newMedia.save();
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
app.get("/", async (req, res) => {
  try {
    const media = await Media.find();
    res.json(media);
  } catch (error) {
    console.log(error);
  }
});

app.get("/movies", async (req, res) => {
  const movies = await Media.find({ type: "Movie" });
  res.json(movies);
});

app.get("/tvshows", async (req, res) => {
  const tvShows = await Media.find({ type: "TV Show" });
  res.json(tvShows);
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
