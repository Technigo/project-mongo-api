import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || 'MONGO_URL'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 9090
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const Track = mongoose.model('Track', {
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

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Track.deleteMany({})

    topMusicData.forEach(track => {
      const newTrack = new Track(track)
      newTrack.save()
    })
  }
  seedDatabase()
}

// Middleware
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('50 popular Spotify tracks, use /endpoints to see them all')
})


// List of endpoints
app.get('/endpoints', (req, res) => {
  res.send(listEndpoints(app))
})

// Get all tracks (and all queries)
app.get('/tracks', async (req, res) => {
  console.log(req.query)
  let tracks = await Track.find(req.query)


  // Track by popularity greater than xx
  if (req.query.popularity) {
    const trackByPopularity = await Track.find().gt('popularity', req.query.popularity)
    tracks = trackByPopularity
  }

  res.json(tracks)
})



// Track by id
app.get('/tracks/:id', async (req, res) => {
  try {
    const trackById = await Track.findById(req.params.id)
  if(trackById) {
    res.json({
      response: trackById,
      success: true
    })
  } else {
    res.status(404).json({ 
      response: 'Track not found',
      success: false
    })
  }
  } catch(error) {
    res.status(400).json({ 
      response: 'Id is invalid',
      success: false
    })
  }
})  

// Track by genre
app.get('/tracks/genre/:genre', async (req, res) => {
  try {
    const trackByGenre = await Track.find(req.res.genre)
  if(trackByGenre) {
    res.json({
      response: trackByGenre,
      success: true
    })
  } else {
    res.status(404).json({ 
      response: 'Track not found',
      success: false
    })
  }
  } catch(error) {
    res.status(400).json({ 
      response: 'Id is invalid',
      success: false
    })
  }
}) 

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
