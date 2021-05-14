import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import netflixTitles from './data/netflix-titles.json'
console.log(netflixTitles.length) // 7787 objects

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// RESET_DB=true npm run dev - --- INITIALIZE THE DATABASE *

const titlesSchema = new mongoose.Schema({
  show_id: String,
  type: String, 
  title: String,
  director: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Director',
  },
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String, 
  duration: String,
  listed_in: String,
  description: String
})

const directorsSchema = new mongoose.Schema({
  name: String
})

// 1st argument Title, 2nd argument the Schema
const Title = mongoose.model('Title', titlesSchema) //mongoDB takes the string 'Title' and changing the Uppercase to lowercase + s = titles

const Director = mongoose.model('Director', directorsSchema) //Name same as variable - a rule of thumb

if (process.env.RESET_DB) {
  console.log('Resetting database')
  const seedDB = async () => {
    await Title.deleteMany()
    await Director.deleteMany()

    let directors = []

    netflixTitles.slice(0,100).forEach(async item => {  // remove slice or change to 800 objects or similar for deployment purpose
      const director = new Director({"name": item.director}) 
      
      if (item.director != "") {
        directors.push(director)
        await director.save()  
      } 
    })

    netflixTitles.slice(0,100).forEach(async item => { //remove slice or change to 800 objects or similar for deployment purpose
      const title = new Title({
        ...item,
        director: directors.find(singleDirector => singleDirector.name === item.director)
      })
      await title.save()
    }) 
  }
  seedDB()
  console.log('Seeded the database')
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

// check if mongoose connection is alright
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: `Service unavailable` })
  }
})

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
}) 

// return all titles
app.get('/titles', async (req, res) => {

  try {
    const titles = await Title.find().populate('director')
    res.json({ length: titles.length, data: titles })
  } catch {
    res.status(400).json({ error: 'No results' })
  }
})

app.get('/titles/year', async (req, res) => {
  const { year } = req.query

  try {
    if (year) {
      const queriedYear = await Title.find({release_year: year}).populate('director') // search in release_year after year
      res.json({ length: queriedYear.length, data: queriedYear })
    }
  } catch {
    res.status(400).json({ error: 'No results' })
  }
})

// add else for misspelled use case ** 
/* else {
    res.status(400).json({ error: 'No results' })
  } */
app.get('/titles/cast', async (req, res) => {
  const { name } = req.query

  try {
    if (name) {
      const queriedCast = await Title.find({
        cast: {
          $regex: new RegExp(name, "i") // 2 arguments: 1. the string w want to look for 2. i = check fr the string but don't care for case sensitivity
        }
      }).populate('director')
      res.json({ length: queriedCast.length, data: queriedCast })
    }
  } catch {
    res.status(400).json({ error: 'No results' })
  }
})

// Return the id of one netflix title
app.get('/titles/:id', async (req, res) => {
  const { id } = req.params

  try {
    const singleTitle = await Title.findById(id).populate('director')
    res.json({ data: singleTitle })
  } catch {
    res.status(404).json({ error: 'ID not found' })
  }
})

// ADD else statement here for when name is misspelled **
// query director by director name
app.get('/directors', async (req, res) => {
  const { director } = req.query

  try {
    if (director) {
      const directors = await Director.find({
        name: {
          $regex: new RegExp(director, "i") // 2 arguments: 1. the string w want to look for 2. i = check for the string but don't care for case sensitivity
        }
      })
      res.json({ length: directors.length, data: directors })
    } else {
      const directors = await Director.find()
      res.json({ data: directors })
    }
  } catch {
    res.status(400).json({ error: 'Director not found' })
  }
})

// id
app.get('/directors/:id', async (req, res) => {
  const { id } = req.params

  try {
    const oneDirector = await Director.findById(id)
    if (oneDirector)  {
      res.json({ data: oneDirector })
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  } catch {
    res.status(400).json({ error: 'Invalid request' })
  }
})

// return all titles of a specific director
app.get('/directors/:id/titles', async (req, res) => {
  const { id } = req.params
  const director = await Director.findById(id)

  try {
    if (director) {
    const titles = await Title.find({ director: mongoose.Types.ObjectId(director.id) })
    res.json({ length: titles.length, data: titles })
    }
  } catch {
    res.status(404).json({ error: 'Director not found'})
  } 
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})