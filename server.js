import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8082
const app = express()

app.use(cors())
app.use(bodyParser.json())

const Track = mongoose.model('Track', {
  trackName: String,
  artistName: String,
  genre: String,
  bpm: Number
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Track.deleteMany({})

    topMusicData.forEach((trackData) => {
      new Track(trackData).save()
    })
  }
  seedDatabase()
}

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/tracks', async (req, res) => {
  const genreQuery = new RegExp(req.query.genre, 'i')
  const bpmQuery = req.query.bpm
  let tracks = await Track.find()

  if (genreQuery && bpmQuery) {
    tracks = await Track.find({
      $and: [{ genre: genreQuery }, { bpm: bpmQuery }]
    })
  } else if (genreQuery || bpm) {
    tracks = await Track.find({
      $or: [{ genre: genreQuery }, { bpm: bpmQuery }]
    })
  }

  if (tracks.length > 0) {
    res.json(tracks)
  } else {
    res.status(404).json({ message: "No tracks found" })
  }
})

app.get('/tracks/:id', async (req, res) => {
  let track

  try {
    track = await Track.findById(req.params.id)
  } catch (error) {
    return res.status(404).json({ message: "Track not found" })
  }

  if (track) {
    res.json(track)
  }
})

app.get('/artists', async (req, res) => {
  const artists = await Track.find()
  res.json(artists)
})

app.get('/artists/:artist/tracks', async (req, res) => {
  const artistName = new RegExp(req.params.artist, 'i')
  let artist
  try {
    artist = await Track.find({ 'artistName': artistName })
  } catch (error) {
    return null
  }

  if (artist.length > 0) {
    res.json(artist)
  } else {
    res.status(404).json({
      message: "Artist not found"
    })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})