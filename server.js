import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

import data from "./data/top-music.json"

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// The port the app will run on.
const port = process.env.PORT || 8080
const app = express()
const listEndpoints = require("express-list-endpoints")

// Add middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })) //Parse URL-encoded data

//Check if the database is available/connected (readyState = 1)
app.use((req, res, next)=>{
  if(mongoose.connection.readyState !== 1){
    res.status(503).json({error: "service unavailable"})
  } else {
    next()
  }
})

const ASong = mongoose.model("ASong", {
  trackName: String,
  artistName: String,
  genre: String,
  length: Number,
  bpm: Number,
  energy: Number,
  danceability: Number,
  popularity: Number
})

if (process.env.RESET_DB) {
  const seedDataBase = async () => {
    await ASong.deleteMany()
    data.forEach(song => {
      new ASong(song).save()
    })
  }
  seedDataBase()
}

// Main route
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
})

//Route to all songs
app.get("/songs", (req, res) => {
  ASong.find().then(song => res.json(song))
});

// Route to one song
app.get("/songs/:songId", async (req, res) => {
  try {
    const song = await ASong.findById(req.params.songId)
    if (song) res.json(song)
    else res.status(404).json({error: "song not found"})
  } catch (error) {
    res.status(400).json({error: "invalid song id"})
  }
})

//Route to a specific genre
app.get("/genres/:specificGenre", async (req, res) => {
  try {
    const song = await ASong.find({genre: req.params.specificGenre})
    if (song) res.json(song)
    else res.status(404).json({error: "There are no songs of that genre"})
  } catch (error) {
    res.status(400).json({error: "invalid genre"})
  }
})

//Route to songs with danceability over 70
app.get("/danceable", (req, res) => {
  ASong.find({ danceability: {$gte: 70} })
    .then(songs => {
      if (songs.length > 0) {
        res.json(songs)
      } else res.status(404).json({error: "There are no dancable songs"})
    }).catch(err => {
      res.status(500).json({error: `Internal server error: $(err)`})})
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
