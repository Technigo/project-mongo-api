import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import topMusicData from './data/top-music.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/tophits"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const Song = mongoose.model('Song', {
  trackName: String,
  artistName: String,
  genre: String

  // type: mongoose.Schema.Types.ObjectId,
  // ref: 'Artist',

})

const Artist = mongoose.model('Artist', {
  artistName: String
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

// Start defining your routes here
// app.get('/', (req, res) => {
//   res.send('Hello world')
// })

//list all the tophits 
app.get('/hits', async (req, res) => {
  const songs = await Song.find()
  res.json(songs)

})

app.get('/hits/hits:id', async (req, res) => {
  const hitSong = await Song.findById(req.params.id)
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
