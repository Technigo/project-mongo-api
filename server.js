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
const userSchema = new Schema ({
  name: String,
  age: Number,
  alive: Boolean
});

const User = mongoose.model("User", userSchema);

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

// ROUTE: ALL SONGS

app.get("/songs", (request, response) => {
  const songs = topMusicData;
  if (songs) {
    response.status(200).json({
      success: true,
      message: "OK",
      body: {
        topMusicData: songs
      }
    })
  } else {
    response.status(500).json({
      success: false,
      message: "Songs not found",
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
          message: "Artist not found!"
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
          message: "No song found!"
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
