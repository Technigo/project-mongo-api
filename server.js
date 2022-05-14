import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/myNetflix'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Stream = mongoose.model('Stream', {
  show_id: String,
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

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Stream.deleteMany()
    netflixData.forEach((stream) => {
      const newStream = new Stream(stream)
      newStream.save()
    })
  }

  seedDatabase()
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
app.use(bodyParser.json())

// Start defining your routes here
// The start with my endponits
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})
// Showing all the movie and tv show
app.get('/myNetflix', async (req, res) => {
  const mystream = await Stream.find()
  res.json(mystream)
})
// So u can search by ID
app.get('/myNetflix/shows/:show_id', (req, res) => {
  const id = req.params.show_id
  Stream.find({ show_id: id })
    .then((results) => {
      res.json(results)
    })
    .catch((err) => {
      res.json({ message: 'Cant find query', err: err })
    })
})
// Get route with title
app.get('/myNetflix/title/:title', async (req, res) => {
  const singleTitle = await Stream.findOne({
    title: req.params.title,
  })
  res.send(singleTitle)
})

//Geting route with year

app.get('/myNetflix/year/:release_year', async (req, res) => {
  const relaseDate = await Stream.find({
    release_year: req.params.release_year,
  })
  res.send(relaseDate)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
