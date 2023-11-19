import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Dataset
import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Creates a model named Movie
const Movies = mongoose.model("Movie", {
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
  type: String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Movies.deleteMany({})

    netflixData.forEach((netflixItem) => {
      new Movies(netflixItem).save()
    });
  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require("express-list-endpoints")

// Middleware to handle error if service is down
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status("503").json({ error: "Service unavailable" })
  }
})

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/movies", (req, res) => {
  Movies.find()
    .then(movies => {
      if (movies.length > 0) {
        res.json(movies);
      } else {
        res.status(404).json({ error: "No movies found" });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "Something went wrong, please try again." });
    });
});

// Gets an individual movie based on its id. 
app.get("/movies/:id", (req, res) => {
  const movieID = parseInt(req.params.id); // Gets the id from the params
  Movies.findOne({ show_id: movieID }).then(movie => { // Checks if the id from the param is the same as the show_id, if it then it's displayed in json. Findone, because I only want one result.
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: `Movie with id ${movieID} not found. Having troubles finding the movie? Make sure you switch out ':id' for the id you wish to base your query on` });
    }
  })
    .catch(error => {
      res.status(500).json({ error: "Something went wrong, please try again." });
    });
});

// Gets all movies with the release year searched for in the querystring. 
app.get("/movies/year/:year", (req, res) => {
  const releaseYear = parseInt(req.params.year); // Gets the id from the params
  Movies.find({ release_year: releaseYear }).then(year => { // Checks if the id from the param is the same as the show_id, if it then it's displayed in json
    if (year.length > 0) {
      res.json(year);
    } else {
      res.status(404).json({ error: `Movie with the release date ${releaseYear} wasn't found` });
    }
  })
    .catch(error => {
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Makes it possible to query on a string included in the title
app.get("/movies/title/:title", (req, res) => {
  const titleQuery = req.params.title.toLowerCase();
  Movies.find({ title: { $regex: titleQuery, $options: "i" } }) // Query-filter. Search is performed on "title", titleQuery is the regex pattern searched for, options: "i" makes the search case-insensitive
    .then(movies => {
      if (movies) {
        res.json(movies);
      } else {
        res.status(404).json({ error: `No movies found with the word '${titleQuery}' in the title` });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
