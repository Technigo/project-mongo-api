import express, { query } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-music"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())


// when searching for artists- all artists-
const TopSong = mongoose.model('TopSong', {
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
  console.log('RESETTING DATABASE')

  const populateDatabase = async () => {
    await TopSong.deleteMany()

    topMusicData.forEach(item => {
      const newTopSong = new TopSong(item)
      newTopSong.save()
    })
  }
  populateDatabase()
}


app.get('/', (req, res) => {
  res.send('Hello sourdough!')
})

app.get('/topsongs', async (req, res) => {
  const queryParameters = req.query
  console.log(queryParameters)

  const allTopsongs = await TopSong.find()
  res.json(allTopsongs)
})




app.get('/topsongs/:artist', async (req, res) => {
  const queryParameters = req.query
  const findArtist = await TopSong.find({ artistName: req.params.artist })
  res.json(findArtist)
})

// app.get('/topsongs/track/:track', async (req, res) => {
//   const findTrack = await TopSong.find({ trackName: req.query.track })
//   res.json(findTrack)
// })

// {being able to search for one artist
// being able to search for one track
// able to search for songs based on 'danceability' - up-tempo or slow. 
// search based on genre? }

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
