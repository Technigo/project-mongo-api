import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Movie = mongoose.model('Movie', {
  title: String,
  release_year: Number,
  type: String,
  rating: String
})

const seedDatabase = async () => {
  await Movie.deleteMany()
  netflixData.forEach((movie) => new Movie(movie).save())

  new Movie({ title: 'Titanic', release_year: 1997, type: 'Movie' }).save()
  new Movie({ title: 'Sons of Anarchy', release_year: 2008, type: 'TV Show' }).save()
  new Movie({ title: 'Forrest Gump', release_year: 1994, type: 'Movie' }).save()
}

seedDatabase()

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  // res.send('Hello world')
  Movie.find().then(movies => {
    res.json(movies)
  })
})

//Find by title: http://localhost:8080/title/Titanic
app.get('/title/:title', (req, res) => {
  Movie.findOne({ title: req.params.title }).then(movie => {
    if (movie) {
      res.json(movie)
    } else {
      res.status(404).json({ error: 'Movie not found!' })
    }
  })
})


// Find by type: http://localhost:8080/multiple/?type=Movie
// type & release_year: http://localhost:8080/multiple?type=Movie&release_year=2019
// type & release_year & rating: http://localhost:8080/multiple?type=Movie&release_year=2019&rating=TV-G
app.get('/multiple', (req, res) => {

  Movie.find({
    ...req.query,
    type: new RegExp(req.query.type, 'i'),
    rating: new RegExp(req.query.rating, 'i'),
  }).then(movies => {
    if (movies.length > 0) {
      res.json(movies)
    } else {
      res.status(404).json({ error: "Couldn't find a match for your filter. Try again!" })
    }
  })
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
