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
  releaseYear: Number,
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
    Welcome: "Welcome to my Netflix API"
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

// route with all shows (both movies and other) from the provided country. spelling needs to be precise
app.get('/countries/:country', async (req, res) => {
  // req is an object with properties such as query and params, 
  // both query and params are empty objects from the beginning 
  // every query parameter consists of key and value
  // Try/catch will handle invalid search terms(error 400). If the search term is valid, but doesn't give a result, you get error 404
  try {
    const contentByCountry = await NetflixEntry.find({ country: req.params.country })
  
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

// route provides all Netflix-shows and has the possibility to query for director and cast in the database. The RegExp for makes the filtering caseinsensitive and provides the possibility to just search for parts of the word.You can also do pagination by setting skip & limit as query parameters
app.get('/people', async (req, res) => {
  const { director, cast, page, limit } = req.query
  const people = await NetflixEntry.find({
    director: new RegExp(director, 'i'),
    cast: new RegExp(cast, 'i')
  }).skip(+page).limit(+limit)

  if (people.length === 0) {
    res.send({ response: "Sorry, but we couldn't find any shows that fit your search" })
  } else {
    res.json({
      response: people,
      success: true
    }) 
  }
})

// route provides all Netflix-shows and has the possibility to query for every Entry in the database. SearchTerms have to be precise.
app.get('/shows', async (req, res) => {
  const shows = await NetflixEntry.find(req.query)

  if (shows.length === 0) {
    res.send({ response: "Sorry, but we couldn't find any shows that fit your search" })
  } else {
    res.json({
      response: shows,
      success: true
    }) 
  }
})

// route provides one movie by ID
app.get('/shows/:id', async (req, res) => {
  try {
    const movie = await NetflixEntry.findById(req.params.id)
  
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

// route provides one movie by title 
app.get('/movies/title/:title', async (req, res) => {
  try {
    const movie = await NetflixEntry.findOne({ type: "Movie", title: req.params.title })

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
