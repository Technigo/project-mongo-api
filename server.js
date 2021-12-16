import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import data from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/movies";
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log("Something went wrong!", err));
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

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

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Media.deleteMany({});

    // adapting the information so that it match the mongoose model I set up.
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

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Shows all of the data at / and enables a querie param filter for the releaseYear and country
// The query param filter is made so that you easily can implement new filters based on the data from the json.
app.get("/", async (req, res) => {
  const { releaseYear, country } = req.query;

  let filter = {};
  if (releaseYear) {
    filter.releaseYear = releaseYear;
  }
  if (country) {
    filter.country = country;
  }
  const media = await Media.find(filter);
  res.json(media);
});

// Finds all types that are movies at /movie
app.get("/movies", async (req, res) => {
  const movies = await Media.find({ type: "Movie" });
  res.json(movies);
});

// Finds all types that are tv shows at /tvshows
app.get("/tvshows", async (req, res) => {
  const tvShows = await Media.find({ type: "TV Show" });
  res.json(tvShows);
});

// find the id that matches what the user puts in in the path parameter.
// if the id written by the user is not a number the API will return a error message (400)
// If the id written by the user doesnt exist the API will return a error message (404)

app.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.status(400).json({
      response: "The id has to be a number, please try again!",
      success: false,
    });
  }
  const media = await Media.findOne({ id: id });
  if (media) {
    res.json(media);
  } else {
    res.status(404).json({
      response: "No movie or tv show found by that id, please try another!",
      success: false,
    });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
