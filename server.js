import express from 'express'
import listEndpoints from 'express-list-endpoints'
// import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import topMusicData from './data/top-music.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//specify the model from dataset. The object is called schema
//make all fields lowercase
// try to exclude some of the keys
//implement try/catch on all. Implement some mongo queries
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
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
})

const Track = mongoose.model('Track', trackSchema)

// const roleSchema = new mongoose.Schema({
//   description: String
// })

// const Role = mongoose.model('Role', roleSchema) {

// }

//write in terminal RESET_DB=true npm run dev // to run
if (process.env.RESET_DB) {
  console.log('seeding!')
  const seedDB = async () => {
    //to be sure the DB is empty to avoid duplicates
    await Track.deleteMany()

    await topMusicData.forEach(track => {
      new Track(track).save()
    })
  }
  
  seedDB()
}

const newTrack = new Track({
  id: 433,
  trackName: "a new song",
  artistName: "a new artist",
  genre: "basic",
  bpm: 44,
  energy: 1,
  danceability: 56,
  loudness: 3,
  liveness: 67,
  valence: 1,
  length: 89,
  acousticness: 78,
  speechiness: 8,
  popularity: 7
})
newTrack.save()

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
// app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send({ 
    Queries: { }, 
    Endpoints: listEndpoints(app) })
})

app.get('/tracks', async (req, res) => {
  const { name } = req.query

  if (name) {
    const tracks = await Track.find({
      name: {
        $regex: new RegExp(name, "i") //first waht to look for second options. g looks for occurencies."i" dont care about case upper or lower
      }
    })
    res.json({'length': tracks.length, 'data': tracks })
  } else {
    const tracks = await Track.find()
    res.json({'data': tracks })
  }

})

//build an endpoint to look for one specific member(track item)

app.get('/tracks/:trackId', async(res, req) => { 
  //destruct queries & params (always do)
  const { trackId } = req.params //old version const id = req.params.id. can add multiple in new version
 
  try {
    const singleTrack = await Track.findById(trackId) //the field we will check in document has name "_id" in mongoose. Use the ones from mongo because we know that they are unique
    if (singleTrack) {
      res.json({'data': singleTrack})
    } else { // if its not found it is still successful from backend side. 
      res.status(404).json ({ error: 'Not found' })
    }
  } catch {
      response.json(400).json({ error: 'Invalid request'})
  }
 
  res.json({'data': singleTrack}) //returning array of one object because of find method (and not just object) use 'findOne' mongo metod gives only the object and not in array

})

app.get('/tracks/name/:trackName', async (req, res) => {

  const { trackName } = req.params

  try {
    const singleTrack = await Track.findOne({ name: trackName })
    res.json(singleTrack) //gives object and not array of object not case sensitive at the moment
  } catch(error) {
    res.status(400).json({ error: 'Something went wrong', details: error })
  }

})
//query for filtering params for unique. query is optional

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
