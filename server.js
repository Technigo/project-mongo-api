import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import topMusicData from './data/top-music.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.Promise = Promise

const musicTrackSchema = new mongoose.Schema({
  id: Number,
  trackName: {
    type: String,
    lowercase: true
  },
  artistName: {
    type: String,
    lowercase: true
  },
  genre: {
    type: String,
    lowercase: true
  },
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

const MusicTrack = mongoose.model('MusicTrack', musicTrackSchema)

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await MusicTrack.deleteMany()

    await topMusicData.forEach(item => {
      const NewMusicTrack = new MusicTrack(item)
      NewMusicTrack.save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({
      error: `Service unavailable`
    })
  }
})

//root
app.get('/', (req, res) => {
  res.send('Popular Music API')
})

//all tracks, all info + query trackname and artist
app.get('/tracks', async (req, res) => {
  const { trackname, artist } = req.query

  try {
    const tracks = await MusicTrack.aggregate([{
      $match: {
        trackName: {
          $regex: new RegExp(trackname || '', 'i')
        },
        artistName: {
          $regex: new RegExp(artist || '', 'i')
        }
      }
    }])

    if (tracks.length) {
      res.json({ length: tracks.length, data: tracks })
    } else {
      res.status(404).send({ message: `No match found` })
    }
  } catch {
    res.status(400).json({ error: `Invalid request` })
  }
})

//sorts all tracks based on popularity
app.get('/tracks/popularity', async (req, res) => {

  try {
    let tracks = await MusicTrack.find()
    tracks = tracks.sort((a, b) => b.popularity - a.popularity)
    res.json({ length: tracks.length, data: tracks })
  } catch {
    res.status(400).json({ error: `Invalid request` })
  }

})

//one track, by ID
app.get('/tracks/:trackId', async (req, res) => {
  const { trackId } = req.params

  try {
    const track = await MusicTrack.findById(trackId)
    if (track) {
      res.json({ data: track })
    } else {
      res.status(404).json({ error: `Track not found` })
    }
  } catch (error) {
    res.status(400).json({ error: `Invalid request` })
  }
  res.json({ data: track })
})

//all artists - dictionary
app.get('/artists', async (req, res) => {
  try {
    const tracks = await MusicTrack.find()
    let artistsDuplicated = tracks
      .map(item => item.artistName)

    let artistsUnique = []
    artistsDuplicated.forEach(item => {
      if (!artistsUnique.includes(item)) {
        artistsUnique.push(item)
      }
    })
    res.json({ length: artistsUnique.length, data: artistsUnique })
  } catch {
    res.status(400).json({ error: `Invalid request` })
  }
})

//get all tracks from one artist
app.get('/artists/artist/:artist', async (req, res) => {
  const { artist } = req.params

  try {
    const artists = await MusicTrack.aggregate([{
      $match: {
        artistName: {
          $regex: new RegExp(artist || '', 'i')
        }
      }
    }])

    if (artists.length) {
      res.json({ length: artists.length, data: artists })
    } else {
      res.status(404).send({ message: `No match found` })
    }
  } catch {
    res.status(400).json({ error: `Invalid request` })
  }
})

//all genres - dictionary
app.get('/genres', async (req, res) => {
  try {
    const tracks = await MusicTrack.find()
    let genresDuplicated = tracks
      .map(item => item.genre)

    let genresUnique = []
    genresDuplicated.forEach(item => {
      if (!genresUnique.includes(item)) {
        genresUnique.push(item)
      }
    })
    res.json({ length: genresUnique.length, data: genresUnique })
  } catch {
    res.status(400).json({ error: `Invalid request` })
  }
})

//lists all artists for a specific genre
app.get('/genres/:genre/artists', async (req, res) => {
  const { genre } = req.params

  try {
    const artists = await MusicTrack.find({
      genre: {
        $regex: new RegExp(genre, 'i')
      }
    })

    if (artists.length) {
      res.json({ length: artists.length, data: artists })
    } else {
      res.status(404).send({ message: `No match found` })
    }
  } catch {
    res.status(400).json({ error: `Invalid request` })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})