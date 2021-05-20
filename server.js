import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import topMusicData from './data/top-music.json'
dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const MusicSchema = new mongoose.Schema({
  "id": Number,
  "trackName": {
    type: String,
    lowercase: true
  },
  "artistName": String,
  "genre": String,
  "bpm": Number,
  "energy": Number,
  "danceability": Number,
  "loudness": Number,
  "liveness": Number,
  "valence": Number,
  "length": Number,
  "acousticness": Number,
  "speechiness": Number,
  "popularity": Number
});

const Music = mongoose.model('Music', MusicSchema);


if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Music.deleteMany()
    await topMusicData.forEach(song => {
      const newMusic = new Music(song);
      newMusic.save();
    })
  }
  seedDB();
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if(mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service not available' })
  }
})

app.get('/', (_, res) => {
  res.send('Hello, welcome to Top Music backend')
})

app.get('/tracks', async (_, res) => {
  const tracks = await Music.find();
  if (tracks) {
    res.json(tracks)
  } else {
    res.status(404).json({ error: 'Tracks not found' })
  }
})

app.get('/tracks/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;
    const oneTrack = await Music.findById(trackId)
    if (oneTrack) {
      res.json(oneTrack)
    } else {
      res.status(404).send({ error: 'Tracks not found' })
    }
  } catch (err) {
    res.status(400).send({ error: 'Invalid track ID'})
  }
})


app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
