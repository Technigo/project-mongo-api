import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import topMusicData from './data/top-music.json'

console.log(topMusicData)

// {
//   "id": 1,
//   "trackName": "Señorita",
//   "artistName": "Shawn Mendes",
//   "genre": "canadian pop",
//   "bpm": 117,
//   "energy": 55,
//   "danceability": 76,
//   "loudness": -6,
//   "liveness": 8,
//   "valence": 75,
//   "length": 191,
//   "acousticness": 4,
//   "speechiness": 3,
//   "popularity": 79
// },


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const TopMusic = mongoose.model('TopMusic', {
  id: Number,
  trackName: String,
  artistName: String,
  bpm: Number,
  energy: Number,
  genre: String,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
})

const Artist = mongoose.model('Artist', {
  artistName: String,
  trackName: {
    type: mongoose.Schema.Types.String,
    ref: 'Record'
  }
})

const Record = mongoose.model('Record', {
  trackName: String,
  artistName: {
    type: mongoose.Schema.Types.String,
    ref: 'Artist'
  }
})

if (process.env.RESET_DATABASE) {
  console.log('Resetting the database')

  const seedDatabase = async () => {
    await TopMusic.deleteMany({})
    await Artist.deleteMany({})
    await Record.deleteMany({})

    topMusicData.forEach((artistData) => {
      new TopMusic(artistData).save()
      new Artist(artistData).save()
      new Record(artistData).save()
    })
  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// TopMusic.find finds all the infomation that I've made an model for.
app.get('/lists', async (req, res) => {
  const list = await TopMusic.find()

  res.json(list)
  console.log(list)
})

app.get('/artists', async (req, res) => {
  const artist = await Artist.find().populate('record')
  res.json(artist)
})

//not working
app.get('/artists/:id', async (req, res) => {
  const artist = await TopMusic.findById(req.params.id)
  if (artist) {
    res.json(artist)
  } else {
    res.status(404).json({ errror: 'Artist not found' })
  }
})

app.get('/records', async (req, res) => {
  const record = await Record.find().populate('artist')
  res.json(record)
})

//this returns an empty array
app.get('/artists/:id/records', async (req, res) => {
  const artist = await TopMusic.findById(req.params.id)
  if (artist) {
    const record = await Record.find({ artist: mongoose.Types.ObjectId(artist.id) })
    res.json(record)
  } else {
    res.status(404).json({ errror: 'Artist not found' })
  }

})

app.get('/genre', (req, res) => {
  const queryString = req.query.genre
  console.log(queryString)
  // /pop/ is a regex and i makes it search not being case sensitive
  TopMusic.find({ 'genre': /pop/i })
    .then((results) => {
      //if .find is succesful
      console.log('Found : ' + results)
      res.jsonp(results)
    }).catch((err) => {
      //Error/Failure
      console.log('Error ' + err)
      res.json({ message: 'Cannot find this genre', err: err })
    })
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
