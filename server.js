import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Importing the top-music dataset from json-file:
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

// extracting schema from mongoose:
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
});

const Song = mongoose.model("Song", songSchema);

// here we are resetting the database, will happen only if RESET_DB variable is set to true:
if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach((singleSong) => {
      const newSong = new Song (singleSong);
      newSong.save();
    })
  }
  resetDatabase();
  // call a function while declaring it  - extra curriculum
}

////// DEFINING ROUTES HERE //////

//index route:
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/songs", async (req, res) => {
  // the way I did it in the week before, with the Express API:
  // let allSongs = topMusicData;
  // res.send(allSongs);
  // another way:
  const {genre, danceability} = req.query;
  const response = {
    success: true,
    message: "Here are your songs!",
    body: {}
  }
  // creating new regex (regular expression) that includes all genres with the word "pop" in them:
  const genreRegex = new RegExp(genre);
  // "if (?) there are songs with danceability greater than what the user put in the url, then show list.
  // else (:), show nothing" is what this variable is saying:
  const danceabilityQuery = { $gt: danceability ? danceability : 0 }
  try {
    // this would only get the songs with the genres that exactly match "pop":
    // response.body = await Song.find({genre: genre})
    // every song that includes the word "pop":
    const searchResultFromDB = await Song.find({genre: genreRegex, danceability: danceabilityQuery})
    if (searchResultFromDB) {
      response.body = searchResultFromDB;
      res.status(200).json(response)
    } else {
      response.status(404).json()
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
})

// endpoint to get song by id:
app.get("/songs/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id)
    if (singleSong) {
      res.status(200).json({
        message: "It works, here is your song :)",
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
