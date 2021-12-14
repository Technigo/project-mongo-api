/* eslint-disable max-len */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()
const movies = netflixData.filter((item) => item.type === "Movie")

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// check via middleware, if we are connected to the database
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Making a model of the Netflix-Data for the DB
const NetflixEntry = mongoose.model('NetflixEntry', {
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

// seeding the DB only when typing this RESET_DB-variable in the Terminal. Should only be used, when you are setting a project up. Otherwise alll Userdata is gone!!!
// $ RESET_DB=true npm run dev
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await NetflixEntry.deleteMany() // deletes all content from the DB

    netflixData.forEach((item) => new NetflixEntry(item).save())
  }
  seedDatabase()
}

// Start defining routes here
app.get('/', (req, res) => {
  res.send({
    Welcome: "Welcome to my Netflix API",
    documentation: "https://documenter.getpostman.com/view/18068162/UVR4PW9m"
  })
})

// route provides all endpoints
app.get('/endpoints', (req, res) => {
  res.json({
    response: listEndpoints(app),
    success: true
  })
})

// route provides a sorted list of all countries that are in netflixData
app.get('/countries', async (req, res) => {
  // a list of all countries in the Netflix-Data without any duplicates. Therefore I am creating a Set (object with unique items). I convert the set into an array afterwards and sort it alphabetically
  const countries = await Array.from(new Set(netflixData.map((item) => item.country))).sort()

  res.json({
    response: countries,
    success: true
  })
})

// route with all shows (both movies and other) from the provided country
app.get('/countries/:country', async (req, res) => {
  // req is an object with properties such as query and params, 
  // both query and params are empty objects from the beginning 
  // every query parameter consists of key and value
  // Try/catch will handle invalid search terms(error 400). If the search term is valid, but doesn't give a result, you get error 404
  try {
    const { country } = req.params
    const contentByCountry = await netflixData.filter((item) => item.country.toLowerCase() === country)
  
    if (contentByCountry.length === 0) {
      res.status(404).json({
        response: 'Sorry, but there is no content for this country',
        success: false
      })
    } else {
      res.json({
        response: contentByCountry,
        success: true
      })
    } 
  } catch (err) {
    res.status(400).json({ error: 'Invalid country name' })
  }
})

// route provides all movies and has the possibility to query for director, year and actor. You can also do pagination by setting page & limit as query parameters
app.get('/movies', (req, res) => {
  const { director, year, actor, page, limit } = req.query

  let filteredMovies = movies

  if (director) {
    filteredMovies = filteredMovies.filter((item) => item.director.toLowerCase().includes(director.toLowerCase()))
  }

  if (year) {
    filteredMovies = filteredMovies.filter((item) => item.release_year === +year)
  }

  if (actor) {
    filteredMovies = filteredMovies.filter((item) => item.cast.toLowerCase().includes(actor.toLowerCase()))
  }

  // PAGINATION
  // limit = no. of items to show per page 
  if (page && limit) {
    // first index-no of item from filteredMovies we want to display
    const startIndex = (page - 1) * limit
    // last index-no of item from filteredMovies we want to display
    const endIndex = page * limit 
    // slice gives us what is in between startIndex and endIndex
    const paginationArray = filteredMovies.slice(startIndex, endIndex)
   
    res.json(paginationArray)
  }  

  res.json({
    response: filteredMovies,
    success: true
  })
})

// route provides one movie by ID
app.get('/movies/id/:id', async (req, res) => {
  try {
    const movie = await NetflixEntry.findOne({ type: "Movie", show_id: req.params.id })
  
    if (!movie) {
      res.status(404).json({
        response: 'No movie found, that matches this ID',
        success: false
      })
    } else {
      res.json({
        response: movie,
        success: true
      })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid movie ID' })
  }
})

// route provides movies by name (can return more than one movie, if the provided parts of the title match with several movies)
app.get('/movies/title/:title', async (req, res) => {
  try {
   /*  const { title } = req.params

    const movie = movies.filter((item) => item.title.toLowerCase().includes(title.toLowerCase())) */

    //Error: BY now this only works, if I type the exact title in the URL (how to make it case insensitive and includes?)
    const movie = await NetflixEntry.find({ type: "Movie", title: req.params.title })

    if (movie.length === 0) {
      res.status(404).json({
        response: 'No movie found, that matches this title',
        success: false
      })
    } else {
      res.json({
        response: movie,
        success: true
      })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid movie title' })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
