import express, { response } from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import tracks from './data/top-music.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const trackSchema = new mongoose.Schema({
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
  popularity: Number
})

const Track = mongoose.model('Track', trackSchema)

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Track.deleteMany()
    tracks.forEach(async track => {
      const newTrack = new Track(track)
      await newTrack.save()
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
    res.status(503).send({ error : 'Something went wrong'})
  }
}) 

// ROUTES
app.get('/', (req, res) => {
  res.send({ 
    Queries: { 'trackName' : 'String', 'artistName' : 'String' }, 
    Endpoints: listEndpoints(app) })
})

app.get('/tracks', async (req, res) => {
  const { trackName, artistName } = req.query

  try {
    const tracks = await Track.aggregate([
      {
        $match: {
          trackName: {
            $regex: new RegExp(trackName || "", "i")
          },
          artistName: {
            $regex: new RegExp(artistName || "", "i")
          }
        }
      }])
  
      if (tracks.length === 0) {
        res.send('Not found')
      } else {
        res.json({ Length: tracks.length, Data: tracks})
  
  }} catch(error) {
      res.status(400).send({ error : 'Something went wrong'})
  }
})

app.get('/tracks/:id', async(req, res) => {   
  const { id } = req.params
 
  try {
    const singleTrack = await Track.findById(id) 
      if (singleTrack) {
        res.json({'Data': singleTrack})
      } else {  
        res.send({ error: 'Not found' })
      }
    } catch(error) {
        res.json(400).send({ error: 'Invalid request'})
    }
})

app.get('/tracks/popular/mostpopular', async(req, res) => {

  try {
    const popularTracks = await Track.find({popularity:{$gte:90}})
    res.json({ Length: popularTracks.length, Data: popularTracks })
  } catch(error) {
    res.status(400).send({ error: 'Something went wrong'})
  }
})

app.listen(port, () => {
})
