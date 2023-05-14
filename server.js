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
const listEndPoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here

// ROUTE: START
app.get("/", (req, res) => {
  res.send({
    Message: "Here you can browse the top music data. Below you find the endpoints you can use 🎶",
    Routes: [
      {
        "/songs": "= all songs",
        "/songs/id/:id": "= a specific song based on id, write the id of the song instead of :id",
        "/songs/artist/:artistname": "= get the titles from a specific artist, write the artist instead of :artistname"
      }
    ],
  })
});


// CREATE SCHEMA

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

// ROUTE: ALL SONGS

app.get("/songs", async (req, res) => {
  const songs = topMusicData;
  if (songs) {
    res.status(200).json({
      success: true,
      message: "OK",
      body: {
        topMusicData: songs
      }
    })
  } else {
    res.status(500).json({
      success: false,
      message: "ERROR! Songs not found!",
      body: {}
    })
  }
})

// ROUTE: ARTIST

app.get("/songs/artist/:artistname", async(req,res) => {
  try{
    const artistName = await Song.findOne({artistName: new RegExp(req.params.artistname,"i")}); 
    if(artistName){
      res.status(200).json({
        success: true,
        body: artistName
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "ERROR! Artist not found!"
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

// ROUTE: SONGS ID

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
          message: "ERROR! Song not found!"
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

// START THE SERVER

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
