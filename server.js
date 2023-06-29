import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";
import { getRequireSource } from "@babel/preset-env/lib/polyfills/utils";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";

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
const userSchema = new Schema ({
  name: String,
  age: Number,
  married: Boolean
})

const User = mongoose.model("User", userSchema)


const songSchema = new Schema ({
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

const Song = mongoose.model("Song", songSchema)

// Delete data in database and then import data from json-file to database
if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong);
      newSong.save()
    })
  }
  resetDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});


app.get("/songs/", async (req, res) => {
  const {genre, danceability} = req.query;
  const response = {
    success: true,
    body: {}
  }
  const genreRegex = new RegExp(genre);
  const danceabilityQuery = { $gt: danceability ?
  danceability : 0 }

  try {
    response.body = await Song.find({genre: genreRegex, danceability: danceabilityQuery})
    if (true) {
      res.status(200).json(response)
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Song not found"
        }
     })
    } 
  } catch(e) {
    res.status(500).json(response)
  }
});



// Fetch a song
app.get("/songs/id/:id", async (req, res) => {
  //res.send("Hello Technigo!");
  try {
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
