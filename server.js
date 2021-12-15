import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import listEndpoints from 'express-list-endpoints'
import netflixData from './data/netflix-titles.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const NetflixData = mongoose.model('NetflixData', {
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

if (process.env.RESET_DB) {
  const seedDataBase = async () => {
    await NetflixData.deleteMany()

    netflixData.forEach((item) => {
      const newNetflixData = new NetflixData(item)
      newNetflixData.save()
    })
  }
  seedDataBase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())
// if mongodb-community is stopped
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})


app.get('/titles', async (req, res) => {

  let titles = await NetflixData.find(req.query)
  // filter by query release_year, greater than or equal
  if (req.query.release_year) {
    const titlesByYear = await NetflixData.find().gte('release_year', req.query.release_year)
    titles = titlesByYear
  }
  res.json(titles)
})


app.get('/titles/:id', async (req, res) => {
  try {
    const choosenMovie = await NetflixData.findById(req.params.id)
    if (choosenMovie) {
      res.json(choosenMovie)
    } else {
      res.status(404).json({ error: `Movie with this id ${req.params.id} is not found` })
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid movie id" })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
