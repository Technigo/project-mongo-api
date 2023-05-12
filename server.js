import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/imdb-250";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


const listEndpoints = require('express-list-endpoints')

//Defines the properties in the dataset I'm using
const { Schema } = mongoose;
const movieSchema = new Schema ({
    rank: Number,
    movie_id: String,
    title: String,
    year: Number,
    link: String,
    imbd_votes: String,
    imbd_rating: Number,
    certificate: String,
    duration: String,
    genre: String,
    cast_name: String,
    director_name: String,
    storyline: String
})

const Movie = mongoose.model("Movie", movieSchema)

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
})

//Endpoint to show single movie based on it's id (from MongoDB)
app.get("/movies/id/:movie_id", async (req, res) => {
  try {
    const singleMovie = await Movie.findById(req.params.movie_id)
    if (singleMovie) {
      res.status(200).json({
        success: true,
        body: singleMovie
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Movie not found"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })

  }
})

//Queries for genre, year and cast
//RegExp make it possible to only type part of the value from the array
//"i" is the same as toLowerCase()
app.get("/movies", async (req, res) => {
  const {genre, year, cast} = req.query
  const response = {
    success: true,
    body: {}
  }

  try {
    let query = {}
    if (genre) {
      query.genre = new RegExp(genre, "i")

    } if (year) {
      query.year = Number(year)

    } if (cast) {
      query.cast_name = new RegExp(cast, "i")
    }
    
    const resultFromDB = await Movie.find(query)

    if (resultFromDB) {
      response.body = resultFromDB
      res.status(200).json(response)
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Movie not found"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })

  }
})

//Endpoint to show single movie based on it's rank
app.get("/movies/rank/:rank", async (req, res) => {
  try {
    const movieRank = await Movie.findOne({ rank: req.params.rank })
    if (movieRank) {
      res.status(200).json({
        success: true,
        body: movieRank
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Movie not found"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })

  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
