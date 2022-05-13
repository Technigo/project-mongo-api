import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import getEndpoints from 'express-list-endpoints'

import topMusicData from './data/top-music.json'
import { reset } from 'nodemon'

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/project-mongoMongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Song = mongoose.model('Song', {
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

// seed data
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany()
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong)
      newSong.save()
    })
  }
  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here

app.get('/', (req, res) => {
  res.send(getEndpoints(app))
})

// ----- path params -------
app.get('/artists', async (req, res) => {
  //Will show the list of Top Music
  const artists = await Song.find()
  res.json(artists)
})

app.get('/tracks', async (req, res) => {
  const tracks = await Song.find()
  res.json(tracks)
})

app.get('/songs/song/:artistName', async (req, res) => {
  // this will retrive only the first found song
  // create a new variabel and Song is our moongose model
  const singleSong = await Song.find({ artistName: req.params.artistName })
  res.send(singleSong)
})

app.get('/songs/genre/:genre', async (req, res) => {
  //Will retrive the songs that belongs to the genre
  const singleGenre = await Song.find({ genre: req.params.genre })
  res.send(singleGenre)
})

// ----- query params -------
app.get('/songs/song/', async (req, res) => {
  const { artistName, trackName } = req.query

  const myRegex = /.*/gm

  if (trackName) {
    const singleSong = await Song.find({
      artistName: artistName ? artistName : myRegex,
      trackName: trackName
    })
    res.send(singleSong)
  } else {
    const singleSong = await Song.find({ artistName: artistName })
    res.send(singleSong)
  }
})

// http://localhost:8080/songs/song?artistName=Marshmello&trackName=Happier  - en låt från en artist
// http://localhost:8080/songs/song?trackName=Happier  - en låt med ett givet namn
// http://localhost:8080/songs/song?artistName=Marshmello- alla låtar från en artist FUNKAR

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
