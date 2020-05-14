import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/music"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())


const Artist = mongoose.model('Artist', {
  id: String,
  trackName: String,
  artistName: String,
  genre: String,
  danceability: Number
})

//if (process.env.RESET_DATABASE) {
  console.log('resetting the database')
const seedDatabase = async () => {
  await Artist.deleteMany()
  
  topMusicData.forEach((artist) => {
    new Artist(artist).save()
  })
}
seedDatabase()
//}

app.get('/', (req, res) => {
   res.send('Write /artists to get the list of artists') 
})

app.get('/:artists', async (req, res) => {
  const artists = await Artist.find()
  res.json(artists)
})

app.get('/artists/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id)
    if (artist) {
      res.json(artist)
    } else {
      res.status(404).json({error: 'artist not found'})
    }
  } catch (err) {
    res.status(400).json({error: 'invalid artist request'})
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
