import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import topMusicData from './data/top-music.json'

console.log(topMusicData)

// {
//   "id": 1,
//   "trackName": "Señorita",
//   "artistName": "Shawn Mendes",
//   "genre": "canadian pop",
//   "bpm": 117,
//   "energy": 55,
//   "danceability": 76,
//   "loudness": -6,
//   "liveness": 8,
//   "valence": 75,
//   "length": 191,
//   "acousticness": 4,
//   "speechiness": 3,
//   "popularity": 79
// },


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Artist = mongoose.model('Artist', {
  id: Number,
  trackName: String,
  artistName: String,
  bpm: Number,
  energy: Number,
  genre: String,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
})

const Record = mongoose.model('Record', {
  trackName: String,
  artistName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  }
})

if (process.env.RESET_DATABASE) {
  console.log('Resetting the database')

  const seedDatabase = async () => {
    await Artist.deleteMany({})
    await Record.deleteMany({})

    topMusicData.forEach((artistData) => {
      new Artist(artistData).save()
      new Record(artistData).save()
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
  res.send('Hello world')
})

// Artist.find finds all the infomation that I've made an model for.
app.get('/artists', async (req, res) => {
  const artists = await Artist.find()

  res.json(artists)
  console.log(artists)
})

app.get('/records', async (req, res) => {
  const records = await Record.find().populate('artist')
  res.json(records)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
