import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import topMusicData from './data/top-music.json'

// REMEMBER : RESET_DATABASE=true npm run dev

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Artist = mongoose.model('Artist', {
  artistName: String,
  genre: String,
  popularity: Number
})

const Track = mongoose.model('Track', {
  trackName: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  length: Number,
  acousticness: Number
})

const Genre = mongoose.model('Genre', {
  genre: String
})

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Artist.deleteMany({})
    await Track.deleteMany({})
    await Genre.deleteMany({})

    topMusicData.forEach((topMusicData) => {
      new Artist(topMusicData).save()
      new Track(topMusicData).save()
      new Genre(topMusicData).save()
    })

  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world hej hej')
})

app.get('/artists', async (req, res) => {
  const artists = await Artist.find()
  console.log(artists)
  res.json(artists)
})
// this artist search works : http://localhost:8080/artists

app.get('/artist/:id', async (req, res) => {
  const artist = await Artist.findById(req.params.id)
  if (artist) {
    res.json(artist)
  } else {
    res.status(404).json({ error: 'Artist not found' })
  }
})

// this works - one single artist search:  
// http://localhost:8080/artist/5e3acecd61ec7e3a4b84455f

app.get('/tracks', async (req, res) => {
  const tracks = await Track.find()
  console.log(tracks)
  res.json(tracks)
})
// this works: http://localhost:8080/tracks

app.get('/genres', async (req, res) => {
  const genres = await Genre.find()
  console.log(genres)
  res.json(genres)
})
//Works with: http://localhost:8080/genres


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
