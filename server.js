import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;

const songSchema = new Schema({
  "id": Number,
  "trackName": String,
  "artistName": String,
  "genre": String,
  "bpm": Number,
  "energy": Number,
  "danceability": Number,
  "loudness": Number,
  "liveness": Number,
  "valence": Number,
  "length": Number,
  "acousticness": Number,
  "speechiness": Number,
  "popularity": Number
})

const Song = mongoose.model("Song", songSchema);

if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong)
      newSong.save();
    })
  }
  resetDatabase();
}

// Checking the status of the database 
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1 ) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})

// Start page with a list of all endpoints
app.get("/", (req, res) => {
  const welcomeMessage = "Search for top music!";
  const endpoints = listEndpoints(app);

  res.status(200).json({
    success: true,
    message: "OK",
    body: {
      welcomeMessage,
      endpoints
    }
  });
});

// Endpoint for all songs
// Possibility to search for songs with specific requirements
// Search for a genre using a String for example "pop"
// http://localhost:8080/songs?genre=pop
// Search for a min danceability using a Number for example 76
// http://localhost:8080/songs?danceability=76
app.get("/songs", async (req, res) => {
    const { genre, danceability } = req.query;
    const response = {
      success: true,
      body: {}
    }

    // Regex
    const genreRegex = new RegExp(genre);
    const danceabilityQuery = { $gt: danceability ? 
    danceability : 0 };

    try {
      const searchResultfromDB = await Song.find({genre: genreRegex, danceability: danceabilityQuery})
      if (searchResultfromDB) {
        response.body = searchResultfromDB
        res.status(200).json(response)
      } else {
        response.success = false,
        res.status(500).json(response);
    }
  } catch (error) {
    res.status(500).json(response);
  }
});

// Search for a specific endpoint using a songs ID
// The ID needs to be from MongoDB
// for example http://localhost:8080/songs/id/64611da98e828372360c431a
app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id)
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Song not found"
        } 
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      body: {
        message: error
      } 
    });
  }
});


// Search for a specific endpoint using an artists name
// for example http://localhost:8080/artists/Ed%20Sheeran
app.get("/artists/:artistName", async (req, res) => {
  try {
    // RegEx to make the artist name case insensitive
    const artistNameRegex = new RegExp(req.params.artistName, "i");

    const singleArtist = await Song.find({ artistName: artistNameRegex });
    if (singleArtist && singleArtist.length > 0) {
      res.status(200).json({
        success: true,
        body: singleArtist
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Artist not found"
        } 
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      body: {
        message: error
      } 
    });
  }
});

// Search for a specific endpoint using a songs (tracks) name
// for example http://localhost:8080/songs/señorita
app.get("/songs/:trackName", async (req, res) => {
  try {
    // RegEx to make the song name case insensitive
    const trackNameRegex = new RegExp(req.params.trackName, "i");

    const singleTrack = await Song.find({ trackName: trackNameRegex });
    if (singleTrack && singleTrack.length > 0) {
      res.status(200).json({
        success: true,
        body: singleTrack
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Track not found"
        } 
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      body: {
        message: error
      } 
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
