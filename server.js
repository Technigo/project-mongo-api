import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import goldenGlobesData from './data/golden-globes.json'

// Connect to the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// MONGOOSE MODELS
const Movie = mongoose.model('Movie', {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
})

const Category = mongoose.model('Category', {
  category: String
})

const Nominee = mongoose.model('Nominee', {
  nominee: String
})

// INSTANCE OF MODEL //

// if (process.env.RESET_DB) {
  const seedDataBase = async () => {
    await Movie.deleteMany({})
    // await Movie.deleteMany()
    await Category.deleteMany()
    await Nominee.deleteMany()

    await goldenGlobesData.forEach((globesData) => {
      new Movie(globesData).save()
    })
    await goldenGlobesData.forEach((globesData) => {
      new Category(globesData).save()
    })

    await goldenGlobesData.forEach((globesData) => {
      new Nominee(globesData).save()
    })
  }
  seedDataBase()
// }

const port = process.env.PORT || 8080
const app = express()

// Middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// ROUTES
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// Object with all movies
app.get('/movies', async (req, res) => {
  // Queries to filter further by year and winners
  const { year } = req.query
  const { win } = req.query
  
  if (year) {
    const movieByYear = await Movie.find({ year_film: year })
    res.json(movieByYear)
  } else if (win) {
    const movieByWin = await Movie.find({ win: win })
    res.json(movieByWin)
  } else {
    const movies = await Movie.find()
    res.json(movies)
  }
})

// Object with all categories
app.get('/movies/categories', async (req, res) => {
  const categories = await Category.find()
  res.json(categories)
})

// Object with all nominees
app.get('/movies/nominees', async (req, res) => {
  const nominees = await Nominee.find()
  res.json(nominees)
})

// Movies by id
app.get('/movies/id/:id', async (req, res) => {
  const { id } = req.params
  const movieByID = await Movie.findOne({ _id: id })
  res.json(movieByID)
})

// Movies by name
app.get('/movies/name/:name', async (req, res) => {
  const { name } = req.params
  const movieByNominee = await Movie.find({ nominee: name })
  const movieByFilm = await Movie.find({ film: name })
  res.json({ movieByNominee, movieByFilm })
})

// Movies by nominees
app.get('/movies/nominee/:nominee', async (req, res) => {
  const { nominee } = req.params
  const movieByNominee = await Movie.find({ nominee: nominee })
  res.json(movieByNominee)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

