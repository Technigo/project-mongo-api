import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Artist = mongoose.model('Artist', {
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
  const seedDatabase = async () => {
    await Artist.deleteMany({})
  
    topMusicData.forEach((item) => {
      const newArtist = new Artist(item)
      newArtist.save()
    })
  }
  seedDatabase()
}

const port = process.env.PORT || 8081
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.send('API of top songs on Spotify using Mondo DB!')
})

// app.get('/artists', async (req, res) => {
//   const artists = await Artist.find()
//   res.json(artists)
// })

// Endpoint 1, all the data with 50 popular songs on Spotify 
app.get('/songs', (req, res) => {
  res.json(topMusicData)
})

// Endpoint 2, sorting the data on music genre
app.get('/genre/:genre', (req, res) => {
  const genre = req.params.genre
  const songGenre = topMusicData.filter((item) => item.genre === genre)
  res.json(songGenre)
})

// Endpoint 3, showing only one song identified by id
app.get('/songs/:id', (req, res) => {
  const id = req.params.id
  const singleSong = topMusicData.find((song) => song.id === +id)
    res.json(singleSong)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})