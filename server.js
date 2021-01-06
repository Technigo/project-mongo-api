import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8081
const app = express()

app.use(cors())
app.use(bodyParser.json())

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

app.get('/', (req, res) => {
  res.send('API of top songs on Spotify using Mondo DB!')
})

// Endpoint 1, all the data with 50 popular songs on Spotify 
app.get('/songs', async (req, res) => {
  const songs = await Artist.find()
  res.json(songs)
})

// Endpoint 2, sorting the data on music genre
app.get('/genre/:genre', async (req, res) => {
  const { genre } = req.params
  const singleGenre = await Artist.find({genre: genre})
  res.json(singleGenre)
})

// Endpoint 3, showing only one song identified by id
app.get('/songs/id/:id', async (req, res) => {
  const { id } = req.params
  const singleId = await Artist.findOne({id: id})
  res.json(singleId)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})