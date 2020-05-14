import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import topMusicData from './data/top-music.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Database model
const Track = mongoose.model('Track', {
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

// Putting the data in the database
const seedDatabase = async () => {
  await Track.deleteMany()
  topMusicData.forEach((track) => new Track(track).save())
}
seedDatabase()

// To override: PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Endpoint to get all the tracks and pagination
// Queries: page and pageSize
// Usage: localhost:8080/?page=2
// Usage: localhost:8080/?page=2&pageSize=4
app.get('/tracks', async (req, res) => {
  const tracks = await Track.find()
  const page = req.query.page ?? 0
  const pageSize = req.query.pageSize ?? 10
  const startIndex = page * pageSize
  const endIndex = startIndex + +pageSize
  const tracksForPage = tracks.slice(startIndex, endIndex)
  const returnObject = {
    pageSize: pageSize,
    page: page,
    maxPages: parseInt(tracks.length / pageSize),
    numTracks: tracksForPage.length,
    results: tracksForPage
  }
  res.json(returnObject)
})

// Endpoint to filter on genre
app.get('/tracks/:genre', async (req, res) => {
  const { genre } = req.params
  const tracks = await Track.find()
  const filteredByGenre = await tracks.filter((track) => track.genre.toString().toLowerCase().includes(genre))
  if (filteredByGenre.length > 0) {
    res.json(filteredByGenre)
  } else {
    res.status(404).json({ error: `Could not find genre ${genre}` })
  }
})

// Endpoint to get a single track
app.get('/track/:id', async (req, res) => {
  const { id } = req.params
  const track = await Track.findOne({ id: id })
  if (track) {
    res.json(track)
  } else {
    res.status(404).json({ error: `Could not find track with id=${id}` })
  }
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
