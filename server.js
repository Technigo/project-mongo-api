import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import topMusicData from './data/top-music.json'

console.log(topMusicData)


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

const DanceAbility = mongoose.model('DanceAbility', {
  danceability: Number,
  trackName: {
    type: mongoose.Schema.Types.String,
    ref: 'Record'
  }
})

if (process.env.RESET_DATABASE) {
  console.log('Resetting the database')

  const seedDatabase = async () => {
    await TopMusic.deleteMany({})
    await Artist.deleteMany({})
    await Record.deleteMany({})
    await DanceAbility.deleteMany({})

    topMusicData.forEach((artistData) => {
      new TopMusic(artistData).save()
      new Artist(artistData).save()
      new Record(artistData).save()
      new DanceAbility(artistData).save()
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
app.get('/music', async (req, res) => {
  const allMusic = await TopMusic.find()

  res.json(allMusic)
})

app.get('/lists', async (req, res) => {
  const { page } = req.query
  const startIndex = 20 * +page
  const list = await TopMusic.find().skip(startIndex).limit(20).exec()

  res.json(list)
})

app.get('/genre', async (req, res) => {
  const queryString = req.query.q
  const queryRegex = new RegExp(queryString, 'i')
  // /pop/ is a regex and i makes it search not being case sensitive
  const genre = await TopMusic.find({ 'genre': queryRegex })
  if (genre) {
    //if .find is succesful
    console.log('Found : ' + genre)
    res.json(genre);
  } else {
    console.log('Error ' + err)
    res.status(404).json({ message: 'Cannot find this genre', err: err })
  }
})

app.get('/artists', async (req, res) => {
  const artist = await Artist.find().populate('record')
  res.json(artist)
})

//this get works with MongoDBs _id
app.get('/artists/:id', async (req, res) => {
  const artist = await Artist.findById(req.params.id)
  if (artist) {
    res.json(artist)
  } else {
    res.status(404).json({ error: 'Artist not found' })
  }
})

app.get('/records', async (req, res) => {
  const record = await Record.find().populate('artist')
  if (record) {
    res.json(record)
  } else {
    res.status(404).json({ errror: 'Record not found' })
  }
})

//this returns the danceability in a decending order together with the name of the record
app.get('/danceabilities', async (req, res) => {
  const danceability = await DanceAbility.find().populate('record').sort({ 'danceability': -1 })
  if (danceability) {
    res.json(danceability)
  } else {
    res.status(404).json({ errror: 'Danceability not found' })
  }
})





// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
