import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose, { get } from 'mongoose'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise
// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 9000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

//Model to access the DBase
const Music = new mongoose.model('Music',{
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

//Custom enviormental Variable
if (process.env.RESET_DATABASE) {
  console.log('Resetting Database!')
  // Function to populate the DBase 
  const populateDataBase = async () => {
    await Music.deleteMany({})

    topMusicData.forEach(item => {
      const newMusic = new Music(item)
      newMusic.save()
    })
  }
  populateDataBase()
}

// All info from JSON
app.get('/', async (req, res) => {
  const allMusic = await Music.find()
  res.json(allMusic)
})

//Searching with conditionals
app.get('/tracks', async (req, res) => {
  const bpmQuery = parseInt(req.query.bpm)
  const lengthQuery = parseInt(req.query.length)
  const popularityQuery = parseInt(req.query.popularity)
  let tracks = await Music.find()

  if (bpmQuery) {
    tracks = await Music.find({ 'bpm': bpmQuery })
  } else if (lengthQuery){
    tracks = await Music.find({ 'length': lengthQuery })
  } else if (popularityQuery) {
    tracks = await Music.find({ 'popularity': popularityQuery })
  }
  else {
    res.status(404).json({ error: 'Sorry. Track not found'})
  }
  res.json(tracks)
})

// Looking for track by ID
app.get('/tracks/:id', async (req, res) => { 
  const song = await Music.findOne({ id: req.params.id });

  if (song) { 
    res.json(song);
  } else { 
    res.status(404).json({ error: 'Sorry. Track not found'});
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
