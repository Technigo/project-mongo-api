import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
// import topMusicData from './data/topMusicData.json'
import topMusicData from './data/top-music.json'


// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import booksData from './data/books.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Artist = mongoose.model('Artist', {
  artistName: String,
  genre: String,
  popularity: Number
})
// this aertist search works : http://localhost:8080/artists

const Track = mongoose.model('Track', {
  trackName: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  liveness: Number,
  loudness: Number
  // this track search works: http://localhost:8080/tracks 
})

// artist: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'Artist'
// }

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Artist.deleteMany({})
    await Track.deleteMany({})

    topMusicData.forEach((topMusicData) => {
      new Artist(topMusicData).save()
      new Track(topMusicData).save()
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

app.get('/artist/:id', async (req, res) => {
  const artist = await Artist.findById(req.params.id)
  if (artist) {
    res.json(artist)
  } else {
    res.status(404).json({ error: 'Artist not found' })
  }
})

app.get('/tracks', async (req, res) => {
  const tracks = await Track.find()
  console.log(tracks)
  res.json(tracks)
})

// app.get('artistName/:id', async (req, res) => {
//   const artistName = await ArtistName.findById(req.params.id)
//   if (artistName) {
//     res.json(artistName)
//   } else {
//     res.status(404).json({ error: 'Artist not found' })
//   }
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
