import express from "express";
import cors from "cors";
import mongoose from "mongoose";


// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Another middleware - gives an error message if it can't connect to the database
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

const { Schema } = mongoose;
const songSchema = new Schema({
  id: Number,
  trackName: String,
  artistName: String,
  genre: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
})

const Song = mongoose.model("Song", songSchema);

// RESET_DB is an environmental variable, write "RESET_DB=true npm run dev" in terminal to reset database
if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Song.deleteMany()
    topMusicData.forEach((singleSong) => {
    const newSong = new Song (singleSong) 
    newSong.save() // The .save is what actually saves the song to the database
    })
  }
  // Call a function while declaring it  - extra curriculum (do research)
  resetDatabase()
}


// const userSchema = new Schema ({
//   name: String,
//   age: Number,
//   alive: Boolean
// });

// const User = mongoose.model("User", userSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

app.get("/songs", async (req, res) => {
  const { artistName, genre, danceability } = req.query
  const response = {
    success: true,
    body: {}
  }
  // Makes any word search give back search results that includes the word you search for, ex "pop" shows you canadian pop, dance pop etc (works on strings not numbers)
  const artistRegex = new RegExp(artistName)
  const genreRegex = new RegExp(genre)
  // $gt means greater than in moongose
  // if the dancebility value we search for is true return danceability if not return 0
  const danceabilityQuery = { $gt: danceability ? danceability : 0}
  try {
    const searchResultFromDB = await Song.find({artistName: artistRegex, genre: genreRegex, danceability: danceabilityQuery})
    if (searchResultFromDB) {
      response.body = searchResultFromDB
      res.status(200).json(response)
    } else {
      response.success = false,
      res.status(500).json(response)
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});


 // https://lorem.ipsum.io?id=
  // const {id} = req.query;

app.get("/songs/id/:id", async (req, res) => {
  try {
    // Here it is trying to find a song through its id and returns a different status message depending on if it is found or not
    const singleSong = await Song.findById(req.params.id)
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Song not found"
        }      
      })
    }
  } catch(error) {
    res.status(500).json({
      success: false,
      body: {
        message: error
      }
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
