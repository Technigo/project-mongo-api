import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

import netflixTitles from './data/netflix-titles.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

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

const Title = mongoose.model('Title', titlesSchema)

const Director = mongoose.model('Director', directorsSchema)

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Title.deleteMany()
    await Director.deleteMany()

    let directors = []

    // 800 objects for deployment purpose
    netflixTitles.slice(0,800).forEach(async item => {  
      const director = new Director({"name": item.director}) 
      
      if (item.director != "") {
        directors.push(director)
        await director.save()  
      } 
    })

    // 800 objects for deployment purpose
    netflixTitles.slice(0,800).forEach(async item => { 
      const title = new Title({
        ...item,
        director: directors.find(singleDirector => singleDirector.name === item.director)
      })
      await title.save()
    }) 
  }
  seedDB()
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
    res.status(503).json({ error: 'Service unavailable' })
  }
})

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
}) 

// return all titles
app.get('/titles', async (req, res) => {
    const titles = await Title.find().populate('director')
    res.json({ length: titles.length, data: titles })
})

// query by year
app.get('/titles/year', async (req, res) => {
  const { year } = req.query

    if (year) {
      const queriedYear = await Title.find({release_year: year}).populate('director')
      res.json({ length: queriedYear.length, data: queriedYear })
    }
})

// query by cast name
app.get('/titles/cast', async (req, res) => {
  const { name } = req.query

    if (name) {
      const queriedCast = await Title.find({
        cast: {
          $regex: new RegExp(name, "i")
        }
      }).populate('director')
      res.json({ length: queriedCast.length, data: queriedCast })
    }
})

// return the id of one netflix title
app.get('/titles/:id', async (req, res) => {
  const { id } = req.params

  try {
    if (id) {
      const singleTitle = await Title.findById(id).populate('director')
      res.json({ data: singleTitle })
    } 
  } catch {
    res.status(404).json({ error: 'Title id not found' })
}
})

// query director by director name
app.get('/directors', async (req, res) => {
  const { director } = req.query

    if (director) {
      const directors = await Director.find({
        name: {
          $regex: new RegExp(director, "i")
        }
      })
      res.json({ length: directors.length, data: directors })
    } else {
       const directors = await Director.find()
      res.json({ length: directors.length, data: directors })
    }
})

// id of director
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

// catch block is not executed
// return all titles of a specific director
app.get('/directors/:id/titles', async (req, res) => {
  const { id } = req.params
  const director = await Director.findById(id)

  try {
    if (director) {
    const titles = await Title.find({ director: mongoose.Types.ObjectId(director.id) })
    res.json({ length: titles.length, data: titles })
    } else {
      res.status(404).json({ error: 'Director id not found' })
    }
  } catch {
    res.status(400).json({ error: 'Invalid request' })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})