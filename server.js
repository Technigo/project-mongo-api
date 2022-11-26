import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/27017/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// A model of the entries that go into MDB
const Song = mongoose.model("Song", {
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

// An asyncronous function that makes sure that the datebase does not update itself with the same entries 
// every time the server is re-started.
if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany()
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong)
      newSong.save()
    })
  }
  resetDataBase()
}

// Defines the port the app will run on.
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//ROUTES
// Main route
app.get("/", (req, res) => {
  res.json({ 
    responseMessage: "Welcome to Jessika's Spotify API 🎶!",
    routes: {
      "/songs": "search for all songs in the database",
      "/songs?artistName=*NAME OF ARTIST*" : "search for songs by a specific artist",
      "/songs?trackName=*NAME OF TRACK*": "search for a specific track",
      "/songs?genre=*NAME OF GENRE*": "search for a specific genre", 
      "/songs/:id": "search for a song by its unique id"
    }
  } );
});

//ROUTE 1: All songs with query paramenters (genre, track and artist)
app.get("/songs/", async (req, res) => {
  
  const {genre, trackName, artistName} = req.query
  const response = {
    sucess: true,
    body: {}
  }

  const matchAllRegex = new RegExp(".*")
  const genreQuery = genre ? genre : {$regex: matchAllRegex, $options: 'i'}
  const trackQuery = trackName ? trackName : {$regex: matchAllRegex,  $options: 'i' }
  const artistQuery = artistName ? artistName : {$regex: matchAllRegex,  $options: 'i' }

  try {
      response.body = await Song.find({genre: genreQuery, trackName: trackQuery, artistName: artistQuery})
      if (response.body.length > 1) {
        res.status(200).json({
          sucess: true,
          body: response
        })
      } else if (response.body.length === 0) {
      res.status(404).json({
        sucess: false,
        body: {
          message: "Sorry, we could not find what you are looking for"
        }
      })
    }
  } catch (error) {
    res.status(400).json({
      sucess: false,
      body: {
        message: error
      }
    })
  }
})

// ROUTE 2: Find a specific song by its unique ID
app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id)
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      })
    } else {
      res.status(404).json({
        sucess: false, 
        body: {
          message: "Could not find the song"
        }
      })
    }
  } catch(error) {
    res.status(400).json({
      sucess: false, 
      body: {
        message: "Invalid id"
  }
})
}
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})

