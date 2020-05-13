import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import topMusicData from './data/top-music.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/tophits"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const Song = mongoose.model('Song', {
  id: {
    type: Number
  },
  trackName: {
    type: String
  },
  artistName: {
    type: String
  },
  genre: {
    type: String
  }
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany({})

    topMusicData.forEach((songData) => {
      new Song(songData).save()
    })
  }
  seedDatabase()
}

const port = process.env.PORT || 8086
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const listEndpoints = require('express-list-endpoints')

// Root endpoint
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//list all the tophits and query songs by genre
app.get('/hits', async (req, res) => {
  const { genre } = req.query
  const searchSongs = await Song.find({
    genre: new RegExp(genre, 'i'),
  })
  if (searchSongs.length > 0) {
    res.json(searchSongs);

  } else if (genre && searchSongs.length === 0) {
    res.status(404).json({ message: 'Sorry, cannot find any songs in that genre' })

  } else {
    res.json(songData)
  }
})

//Path to one hitsong after id 
app.get('/hits/:id', async (req, res) => {
  const { id } = req.params
  const hitSong = await Song.findOne({ id: id })
  if (hitSong) {
    res.json(hitSong)
  } else {
    res.status(404).json({ error: 'no song with that id found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

//deployed https://hitsongsinmay.herokuapp.com/hits