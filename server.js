import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Song from './models/song.js'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Moved model to separate file

if (process.env.RESET_DATABASE) {
  console.log('Resetting database ...')

  const seedDatabase = async () => {
    // Clear the database
    await Song.deleteMany()
    // Save all songs from topMusic.json to the database
    await topMusicData.forEach((song) => new Song(song).save())
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

// Start defining routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

/* // Get all songs - removed since I get all songs in next endpoint
app.get('/songs', async (req, res) => {
  const songs = await Song.find()
  console.log(`Found ${songs.length} songs ...`)
  res.json(songs)
}) */

// Get all songs: http://localhost:8080/songs
// Get all feelgood songs: http://localhost:8080/songs?feelgood=true
app.get('/songs', async (req, res) => {
  const { feelgood } = req.query
  let songs = await Song.find({})

  if (feelgood === "true") {
    songs = await Song.find({ valence: { $gte: 70 } })
  }
  res.json(songs)
})

// Get one song via song id: http://localhost:8080/songs/4
app.get('/songs/:id', async (req, res) => {
  const { id } = req.params
  const song = await Song.findOne({ id: id })
  if (song) {
    res.json(song)
  } else {
    res.status(404).json({ error: `Could not find song with id ${id}` })
  }
})

// Get one artist: http://localhost:8080/artist/Drake
// Error handling not working
app.get('/artist/:artist', async (req, res) => {
  const { artist } = req.params
  const artistRegex = new RegExp(artist, 'i')
  const artistName = await Song.find({ artistName: artistRegex })
  if (artistName.length !== 0) {
    res.json(artistName)
  } else {
    res.status(404).json({ error: `Could not find artist with name ${artist}` })
  }
})

// Get one genre: http://localhost:8080/genre/pop
// Error handling not working
app.get('/genre/:genre', async (req, res) => {
  const { genre } = req.params
  const genreName = await Song.find({ genre: genre })
  if (genreName.length !== 0) {
    res.json(genreName)
  } else {
    res.status(404).json({
      error: `Could not find songs in genre ${genre}`
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
