import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const Movie = mongoose.model('Movie', {
  "show_id": Number,
  "title": String,
  "director": String,
  "cast": String,
  "country": String,
  "date_added": String,
  "release_year": Number,
  "rating": String,
  "duration": String,
  "listed_in": String,
  "description": String,
  "type": String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Movie.deleteMany({})

    netflixData.forEach((movie) => {
      new Movie(movie).save()
    })
  }

  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Check out /movies :D')
})

app.get('/movies', (req, res) => {
  Movie.find()
    .then((movies) => {
      res.json(movies)
    })
})

app.get('/movies/:id', (req, res) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      res.json(movie)
    })
})

app.get('/movies/years/:year', (req, res) => {
  Movie.find({ release_year: +req.params.year })
    .then((movies) => {
      res.json(movies)
    })
})

app.get('/movies/types/:type', (req, res) => {
  Movie.find({ type: req.params.type })
    .then((movies) => {
      res.json(movies)
    })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
