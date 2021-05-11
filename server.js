import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//specify the model from dataset. The object is called schema
const trackSchema = new mongoose.Schema({
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

const Track = mongoose.model('Track', trackSchema)

//write in terminal RESET_DB=true npm run dev // to run
if (process.env.RESET_DB) {
  console.log('seeding!')
  const seedDB = async () => {
    //to be sure the DB is empty to avoid duplicates
    await Track.deleteMany()

    await topMusicData.forEach(track => {
      new Track(track).save()
    })
  }
  
  seedDB()
}

const newTrack = new Track({
  id: 433,
  trackName: "a new song",
  artistName: "a new artist",
  genre: "basic",
  bpm: 44,
  energy: 1,
  danceability: 56,
  loudness: 3,
  liveness: 67,
  valence: 1,
  length: 89,
  acousticness: 78,
  speechiness: 8,
  popularity: 7
})
newTrack.save()

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
  res.send('Hello world')
})

app.get('/tracks', async (req, res) => {
  const tracks = await Track.find()
  res.json({'data': tracks })
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
