import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

import data from "../data/top-music.json"

//Setting up the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// The port the app will run on.
const port = process.env.PORT || 8080
const app = express()
const listEndpoints = require("express-list-endpoints")

// Add middlewares
app.use(cors())
app.use(express.json()) //Parse incoming JSON-files
app.use(express.urlencoded({ extended: false })) //Parse arrays and strings

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

const seedDataBase = async () => {
  await ASong.deleteMany({})
  data.forEach(song => {
    new ASong(song).save()
  })
}

if (process.env.RESET_DB) {
  seedDataBase()
}

// Main route
app.get("/", (req, res) => {
  res.send(listEndpoints(app))
})

//Route to all songs
app.get("/songs", async (req, res) => {
  let { page = 1, limit = 10 } = req.query

  const limitRecords = parseInt(limit)
  const skip = (page - 1) * limit

  try {
    // Find all songs and filter the song-array by adding the Limit Record and Skip
    const songs = await ASong.find().limit(limitRecords).skip(skip)
    if (songs.length > 0) {
      res.json({ songs, page: page, limit:limitRecords })
    } else {
      res.status(404).json({error: "The database is empty, no songs found"})
    }    
  } catch (error) {
    res.status(500).json({error: "Something went wrong while loading the songs from the database"})
  } 
})

// Route to one song
app.get("/songs/:songId", async (req, res) => {
  try {
    const singleSong = await ASong.findById(req.params.songId)

    if (singleSong) {
      res.json(singleSong)
    } else {
      res.status(404).json({error: "We can't find a song with that ID"})
    }
  } catch (error) {
    res.status(400).json({error: "Invalid song ID, please double check"})
  }
})

//Route to a specific artist
app.get("/artists/:artist", async (req, res) => {
  const paramArtistName = req.params.artist

  //Regex to make it not case-sensitive (option: i) while searching for any of the artists of a song
  const artistSongs = await ASong.find({ artistName: { $regex : new RegExp(paramArtistName, "i") } });

  if (artistSongs === 0) {
    res.status(404).json("We're sorry, this artist hasn't made any songs in our API")
  }

  res.json(artistSongs)
})

//Route to a specific genre
app.get("/genres/:specificGenre", async (req, res) => {
  try {
    const song = await ASong.find({genre: { $regex : req.params.specificGenre, $options: "i" } })

    if (song) {
      res.json(song)
    } else {
      res.status(404).json({error: "There are no songs of that genre"})
    }
  } catch (error) {
    res.status(400).json({error: "This genre isn't stored in our API"})
  }
})

//Route to songs with danceability greater than or equal to 70
app.get("/danceable", (req, res) => {
  ASong.find({ danceability: {$gte: 70} })
    .then(songs => {
      if (songs.length > 0) {
        res.json(songs)
      } else {
        res.status(404).json({error: "There are no dancable songs"})
      }
    })
    .catch(err => {
      res.status(500).json({error: `Internal server error: $(err)`})
    })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
