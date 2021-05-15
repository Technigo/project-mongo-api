import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

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

// Function to start seeding our Database
// will only run if RESET_DB environment variable is present and is true
if (process.env.RESET_DB) {
  const seedDB = async () => {
    // Starts by deleting any pre-existing Movie objects to prevent duplicates when running database
    await Movie.deleteMany()

    netflixData.forEach(async (show) => {
      const newMovie = new Movie(show)
      await newMovie.save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/movies', async (req, res) => {
  const { country, cast, show, page, per_page } = req.query

  await Movie.updateMany(
    { }, 
    { 
      $unset: { show_id: "" }
    }
  )
  const movies = await Movie.aggregate([
    { 
      $match: {
        country: {
          $regex: new RegExp(country, "i")
        }, 
        cast: {
          $regex: new RegExp(cast, "i")
        },
        type: {
          $regex: new RegExp(show, "i")
        }
      }
    }, 
    {
      $skip: Number((page + 1) * per_page + 1)
    }, 
    {
      $limit: Number(per_page)
    }
  ]) 

  res.json({ length: movies.length, data: movies })
})

app.get('/movies/titles', async (req, res) => {
  const title = await Movie.aggregate([
    { $sort: { title: 1 } },
    { $unset: ["_id", "director", "cast", "country", "date_added", "release_year", "rating", "duration", "listed_in", "description", "type", "__v"] }
  ])
  res.json({ length: title.length, data: title })
})

app.get('/movies/genres', async (req, res) => {
  const genre = await Movie.find()
  const filterGenres = genre
    .map((item) => item.listed_in)
    .map((item) => item.split(", "))
  
  let genresUnique = []
  
  filterGenres.forEach((outerItem) => {
    // eslint-disable-next-line no-irregular-whitespace
    outerItem.forEach((innerItem) => {
      if (!genresUnique.includes(innerItem)) {
        genresUnique.push(innerItem)
      }  
    })
  })
  res.json({ length: genresUnique.length, data: genresUnique })
})

app.get('/movies/years', async (req, res) => {
  const year = await Movie.find()
  const filterYear = year.map((item) => item.release_year)
  let yearUnique = []

  filterYear.forEach((item) => {
    if (!yearUnique.includes(item)) {
      yearUnique.push(item)
    }
    return yearUnique.sort().reverse()
  })

  res.json({ length: yearUnique.length, data: yearUnique })
})

app.get('/movies/years/latest', async (req, res) => {
  const genre = await Movie.find(
    { release_year: 
      { 
        $gte: 2018 
      } }, 
    { 
      release_year: 1, title: 1, cast: 1 
    }
  )
 
  res.json({ length: genre.length, data: genre })
})

app.get('/movies/:movieId', async (req, res) => {  
  const { movieId } = req.params

  try {
    const movie = await Movie.findById(movieId)
    if (movie) {
      res.json({ data: movie })
    } else {
      res.status(404).json({ error: 'Not found!' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid request', details: error })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
