import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const MusicSchema = new mongoose.Schema({
  "id": Number,
  "trackName": String,
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

app.get('/', (_, res) => {
  res.send('Hello, welcome to Top Music backend')
})

app.get('/tracks', async (req, res) => {
  const tracks = await Music.find();
  res.json(tracks)
})

app.get('/tracks/:id', async (req, res) => {
  const { id } = req.params;
  const oneTrack = await Music.findOne({ _id: id })
  res.json(oneTrack)
})



// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
