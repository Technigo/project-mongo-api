import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import netflixData from './data/netflix-titles.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/vods"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const Metadata = mongoose.model('Metadata', {
  show_id: {
    type: Number
  },
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: { type: Date, default: Date.now },
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Metadata.deleteMany({})

    netflixData.forEach((netflixRecord) => {
      new Metadata(netflixRecord).save()
    })
  }

  seedDatabase()
}
// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  Metadata.find().then(vods => {
    res.json(vods)
  })
})

app.get('/vods', (req, res) => {
  Metadata.find().then(vods => {
    res.json(vods)
  })
})

app.get('/titles', (req, res) => {
  const queryString = req.query.q
  const queryRegex = new RegExp(queryString, "i")
  Metadata.find({ 'title': queryRegex })
    .then((results) => {
      // Succesfull search
      console.log('Found: ' + results)
      res.json(results)
    }).catch((err) => {
      // errors
      console.log('Error' + err)
      res.json({ message: 'cannot find this title', err: err })
    })
})

app.get('/shows', (req, res) => {
  let queryString = req.query.type
  queryString = queryString.toLowerCase().replace(/[-_ ]/, "")
  if (["show", "tv", "tvshow"].includes(queryString)) {
    queryString = "TV Show"
  } else if (queryString === "movie") {
    queryString = "Movie"
  }

  Metadata.find({ 'type': queryString })
    .then((results) => {
      //Succesfull search
      res.json(results)
    }).catch((err) => {
      //errors
      res.json({ message: 'cannot find this type of show', err: err })
    })
})

app.get('/shows/:id', (req, res) => {
  const show_id = req.params.id
  Metadata.find({ 'show_id': show_id })
    .then((results) => {
      res.json(results)
    })
    .catch((err) => {
      console.log('Error' + err)
      res.json({ message: 'cannot find this show with this id', err: err })
    })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
