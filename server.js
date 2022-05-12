import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const User = mongoose.model('User', {
  name: String,
  age: Number,
  deceased: Boolean,
})

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
  popularity: Number,
})

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
  res.send(listEndpoints(app))
})

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
  //Will retrive only the first found song
  const singleSong = await Song.findOne({ artistName: req.params.artistName })
  res.send(singleSong)
})

app.get('/songs/genre/:genre', async (req, res) => {
  //Will retrive the songs that belongs to the genre
  const singleGenre = await Song.find({ genre: req.params.genre })
  res.send(singleGenre)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
