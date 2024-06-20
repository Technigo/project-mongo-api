import express from "express"
import cors from "cors"

import expressListEndpoints from "express-list-endpoints"
import mongoose from "mongoose"
import { Song } from "./Models/Song"

const mongoURL = process.env.MONGO_URL || "mongodb://localhost/top-music"
mongoose.connect(mongoURL)
mongoose.Promise = Promise

// import the data
import topMusicData from "./data/top-music.json"

//Seed the database
const seedDatabase = async () => {
  await Song.deleteMany()

  topMusicData.forEach((song) => {
    new Song(song).save()
  })
}
seedDatabase()

// Defines the port the app will run on.
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
// http://localhost:8080
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})
// Get all top music songs
// http://localhost:8080/top-music
app.get("/top-music", async (req, res) => {
  const allMusic = await Song.find()

  if (allMusic.length > 0) {
    res.json(allMusic)
  } else {
    res.status(404).send("No music was found :(")
  }
})

//Endpoint to fetch a song by trackname
app.get("/top-music/trackname", async (req, res) => {
  const { trackName } = req.params
  const songByTrackName = await Song.find({
    trackname: { $regex: new RegExp(trackName, "i") },
  }).exec()

  if (songByTrackName.length > 0) {
    res.json(songByTrackName)
  } else {
    res.status(404).send(`No song was found based on typed trackname`)
  }
})

//Endpoint to fetch a song genre
app.get("/top-music/genre", async (req, res) => {
  // const genreSearch = await Song.find({req.query.genre;
  const { genre } = req.params
  const songByGenre = await Song.find({
    genre: { $regex: new RegExp(genre, "i") },
  }).exec()

  if (songByGenre.length > 0) {
    res.json(songByGenre)
  } else {
    res.status(404).send(`No song was found based on typed genre`)
  }
})

// Endpoint to fetch song by id
app.get("/top-music/:songID", async (req, res) => {
  const { songID } = req.params
  const song = await Song.findByID(songID).exec()

  if (song) {
    res.json(song)
  } else {
    res.status(404).send("No song with that ID was found :(")
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
