import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { param } from 'express/lib/request'
import dotenv from 'dotenv'

dotenv.config()

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
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

// Start defining your routes here
app.get('/', async (req, res) => {
  const netflixTitles = await Title.find().limit(30)

  res.json(netflixTitles)

  //res.send(process.env.API_KEY)
})

// Start defining your routes here

// all titles
app.get('/titles/:title', async (req, res) => {
  // Title.find({name: "spaceex"})
  console.log(req.params.title)
  //  req.query is an empty object, can but it inside fun
  const netflixOnlyTitles = await Title.find({})
  res.json(netflixOnlyTitles)
  //async function and can take long time = använd async o await, se process.env function
})

app.get('/movies', async (req, res) => {
  const netflixOnlyMovies = await Title.find({ type: 'Movie' }).limit(5)
  res.json(netflixOnlyMovies)
})

// app.get('/titles/titles', async (req, res) => {
//   const netflixOnlyMovies = await Title.find().limit(5)
//   res.json(netflixOnlyMovies)
// })

// app.get('/titles', async (req, res) => {
//   // Title.find({name: "spaceex"})
//   console.log(req.query)
//  //  req.query is an empty object, can but it inside fun
//  const netflixTitles = await Title.find(req.query)
//  res.json(netflixTitles)
//   //async function and can take long time = använd async o await, se process.env function
//  })

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

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
