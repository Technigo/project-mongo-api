import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
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

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;
// const userSchema = new Schema ({
//   name: String,
//   age: Number,
//   alive: Boolean
// });

// const User = mongoose.model("User", userSchema);

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

// delete.Many() resets the whole database bu deleting all data
if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong);
      newSong.save() // saves all the songs to the DB
    }) 
  }
  resetDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// http://localhost:8080/songs?genre=pop to list all songs in genre pop
app.get("/songs", async (req, res) => {
  const {genre, danceability} = req.query;
  const response = {
    success: true,
    body: {}
  }
  // Regex - Regularexpresseion to get all the pop genres such as canadian pop etc. 
  // RegEx only works on string
  // http://localhost:8080/songs?genre=pop&danceability=76 shows songs in gnre pop and with danceability greater than 76
  const genreRegex = new RegExp(genre);
  const danceabilityQuery = { $gt: danceability ? danceability : 0 } // gt = greater then lt = lower then
  try {
    const searchResultFromDB = await Song.find({genre: genreRegex, danceability: danceabilityQuery}) 
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

// http://localhost:8080/songs/id/645f77ae555b7244afb95eaf shows a specific justin Bieber song
app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id);
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
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
