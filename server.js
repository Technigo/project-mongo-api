import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { param } from 'express/lib/request'
import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

// for password file
dotenv.config()

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

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

if (process.env.RESET_DB) {
  const seeDatabase = async () => {
    await Title.deleteMany({})

    console.log('hello')
    netflixData.forEach((data) => {
      const newTitle = new Title(data)
      newTitle.save()
    })
  }
  seeDatabase()
}

//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', async (req, res) => {
  res.send(listEndpoints(app))
})

//all netflix titles here, be able to searc for a title and type
app.get('/titles', async (req, res) => {
  const title = req.query.title?.toLowerCase()
  const type = req.query.type?.toLowerCase()

  const findFilter = {}

  if (title) {
    findFilter.title = { $regex: new RegExp(title, 'i') }
  }

  if (type) {
    findFilter.type = { $regex: new RegExp(type, 'i') }
  }

  const allTitles = Title.find(findFilter)
  const netflixTitles = await allTitles.limit(50)

  if (netflixTitles.length !== 0) {
    res.json(netflixTitles)
  } else {
    res.status(404).json('title not found')
  }
})

//one title
app.get('/titles/id/:id', async (req, res) => {
  const { id } = req.params
  //restructure it it with {}
  // netflixTitles.find(())

  try {
    const titleId = await Title.findById(id)
    if (titleId) {
      res.json(titleId)
    } else {
      res.status(404).json('title with that id not found')
    }
  } catch (err) {
    res.status(400).json('error: id is invalid')
  }

  //async function and can take long time = använd async o await, se process.env function
})

app.get('/movies', async (req, res) => {
  const netflixOnlyMovies = await Title.find({ type: 'Movie' }).limit(5)
  res.json(netflixOnlyMovies)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
