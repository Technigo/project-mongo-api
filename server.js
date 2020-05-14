import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//model for the entries in the database
const Title = mongoose.model('Title', {
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
  type: String,
})

//seeding the database
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Title.deleteMany({})

    netflixData.forEach((titleData) => {
      new Title(titleData).save()
    })
  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8082
const app = express()

const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//route to all titles & queries
app.get('/titles', async (req, res) => {
  const { title, cast, country } = req.query
  //i means to ignore case
  const titleRegex = new RegExp(title, 'i')
  const castRegex = new RegExp(cast, 'i')
  const countryRegex = new RegExp(country, 'i')
  //sorting in descending order, 1 for ascending
  const titles = await Title.find({
    title: titleRegex,
    cast: castRegex,
    country: countryRegex,
  }).sort({ release_year: -1 })
  if (titles) {
    res.json(titles)
  } else {
    res.status(404).json({ error: `No results, try another query` });
  }
})

//route to one title by show_id
app.get('/titles/:show_id', async (req, res) => {
  const { show_id } = req.params
  const title = await Title.findOne({ show_id: show_id })
  if (title) {
    res.json(title)
  } else {
    res.status(404).json({ error: `Could not find title with show id ${show_id}` });
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
