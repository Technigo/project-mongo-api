import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/top'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const Music = mongoose.model('Music', {
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
    await Music.deleteMany({})

    topMusicData.forEach((item) => {
      new Music(item).save()
    })
  }

  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Defining my routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})
app.get('/top', async (req, res) => {
  const { trackName, artistName, genre } = req.query

  try {
    const allMusic = await Music.find({
      trackName: new RegExp(trackName, 'i'),
      artistName: new RegExp(artistName, 'i'),
      genre: new RegExp(genre, 'i'),
    })
    res.json(allMusic)
  } catch (error) {
    res.status(400).json({
      error: 'cannot find',
    })
  }
})

app.get('/top/:id', async (req, res) => {
  try {
    const song = await Music.find(req.params)
    if (song) {
      res.json(song)
    } else {
      res.status(404).json({ error: 'Cannot get song by that index' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid index' })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port} go go go`)
})
