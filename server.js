import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const movieSchema = new mongoose.Schema({
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String, 
  date_added: String,
  release_year: Number,
  rating: String, 
  duration: String, 
  listed_in: String,
  description: String, 
  type: String
})

const Movie = mongoose.model('Movie', movieSchema)

// Things to read on: reset_db, new, save, two id:s
if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Movie.deleteMany()
    await netflixData.forEach((show) => {
      const newMovie = new Movie(show)
      newMovie.save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// OK
app.get('/movies', async (req, res) => {
  const movies = await Movie.find()
  res.json({ length: movies.length, data: movies })
})

// OK
app.get('/titles', async (req, res) => {
  const title = await Movie.find()
  const filterTitles = title.map((item) => item.title)
  const sortTitles = filterTitles.sort()

  res.json({ length: sortTitles.length, data: sortTitles })
})

// don't get console log in terminal? How can I split?
app.get('/genres', async (req, res) => {
  const genre = await Movie.find()
  const filterGenres = genre.map((item) => item.listed_in)
  let genresUnique = []
  
  filterGenres.forEach((item) => {
    if (!genresUnique.includes(item)) {
      genresUnique.push(item)
    } 
  })
  res.json({ length: genresUnique.length, data: genresUnique })
})

// How to do with two ID:s? Error message dosen't work.
app.get('/movies/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id)
  if (movie) {
    res.json({ data: movie })
  } else {
    res.status(404).json({ error: 'Not found!' })
  } 
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
