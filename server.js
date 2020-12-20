import express, { query } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-music"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

const ERROR_404 = "Sorry, can't find what you are looking for, please try again"

const TopSong = mongoose.model('TopSong', {
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


if (process.env.RESET_DATABASE) {
  console.log('RESETTING DATABASE')

  const populateDatabase = async () => {
    await TopSong.deleteMany()

    topMusicData.forEach(item => {
      const newTopSong = new TopSong(item)
      newTopSong.save()
    })
  }
  populateDatabase()
}

app.get('/', (req, res) => {
  res.send('Hello sourdough! Here you can search after your favourite /artist, /track or /genre. Enjoy!')
})

app.get('/topsongs', async (req, res) => {
  let filteredTopsongs = await TopSong.find()
  const { minDanceability, maxDanceability, genre, length } = req.query

  if (maxDanceability) {
    filteredTopsongs = filteredTopsongs.filter(track => track.danceability <= maxDanceability)
  }
  if (minDanceability) {
    filteredTopsongs = filteredTopsongs.filter(track => track.danceability >= minDanceability)
  }

  res.json(filteredTopsongs)
})

app.get('/topsongs/artist/:artist', async (req, res) => {
  const artistRegexp = new RegExp(req.params.artist, "i")
  const songsWithArtist = await TopSong.find({ artistName: artistRegexp })
  if (songsWithArtist.length === 0) {
    res.status(404).json(ERROR_404)
  } else {
    res.json(songsWithArtist)
  }
})

app.get('/topsongs/track/:track', async (req, res) => {
  const trackRegexp = new RegExp(req.params.track, "i")
  const songsWithTrack = await TopSong.find({ trackName: trackRegexp })
  if (songsWithTrack.length === 0) {
    res.status(404).json(ERROR_404)
  } else {
    res.json(songsWithTrack)
  }
})

app.get('topsong/genre/:genre', async (req, res) => {
  const genreRegExp = new RegExp(req.params.genre, "i")
  const songsInGenre = await TopSong.find({ genre: genreRegExp })
  if (songsInGenre.length === 0) {
    res.status(404).json(ERROR_404)
  } else {
    res.json(songsInGenre)
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})