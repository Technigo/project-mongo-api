import express from 'express'
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
  danceability: Number ,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
})

if(process.env.RESET_DATABASE){
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
  res.send('Hello surdeg!')
})

app.get('/topsongs', async (req, res) => {
  const topsongs = await TopSong.find()
  res.json(topsongs)
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


//being able to search for one artist
//being able to search for one track

// search based on genre? 

  
//able to search for songs based on 'danceability' - up-tempo or slow!  
