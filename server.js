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
  //_id: { type: String, required: true }, // Added --->  make _id to a string. if not want to deal with _id and id?
  show_id: String,
  type: String, 
  title: String,// can also be a number. ({ any: Schema.Types.Mixed })
  director: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Director',
  },
  cast: {
    type: String,
    lowercase: true
  },
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

    netflixTitles.slice(0,100).forEach(async item => {  // remove slice or change to 1000 objects or similar for deployment purpose
      const director = new Director({"name": item.director}) 
      
      if (item.director != "") {
        directors.push(director)
        await director.save()  
      } 
    })

    netflixTitles.slice(0,100).forEach(async item => { //remove slice or change to 1000 objects or similar for deployment purpose
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
  // universal version
  const titles = await Title.find().populate('director') // populate title with director object
  res.json({ length: titles.length, data: titles })
})

// query titles by names in cast ---- ? doesn't work right now. * 
app.get('/titles/cast', async (req, res) => {
  const { cast } = req.query

  if (cast) {
    console.log(cast) // cast is undefined
    const cast = await Title.find({
      cast: {
        $regex: new RegExp(cast, "i") // 2 arguments: 1. the string w want to look for 2. i = check fr the string but don't care for case sensitivity
      }
    })
    res.json({ length: cast.length, data: cast })
    } else {
      const cast = await Title.find()
      res.json({ data: cast })           // What would be the else case for this? 
    }
  })

// Return the id of one netflix title
app.get('/titles/:id', async (req, res) => {
  const { id } = req.params

  try {
    const singleTitle = await Title.findById(id)
    // const directorOfTitle = await Director.findbyId(title.director)
    res.json({ data: singleTitle }) // , data: directorOfTitle
  } catch(error) {
    res.status(404).json({ error: 'ID not found' })
  }
})

// query director by director name
app.get('/directors', async (req, res) => {
  const { director } = req.query

  if (director) {
  const directors = await Director.find({
    name: {
      $regex: new RegExp(director, "i") // 2 arguments: 1. the string w want to look for 2. i = check for the string but don't care for case sensitivity
    }
  })
  res.json({ length: directors.length, data: directors })
  } else {
    const directors = await Director.find()
    res.json({ data: directors })           // What would be the else case for this? 
  }
})

// id
app.get('/directors/:id', async (req, res) => {
  // console.log(mongoose.isValidObjectId(req.params.id))
  const { id } = req.params

  try {
    const oneDirector = await Director.findById(id)
    res.json({ data: oneDirector })
  } catch(error) {
    res.status(404).json({ error: 'Director id not found' })
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
  } catch(error) {
   res.status(400).json({ error: 'Director not found'})
 } 
})

// WHEN it starts to work, destructure it as a query under titles instead
app.get('/releaseyear', async (req, res) => {
  const { year } = req.query

  if (year) {
    console.log(year) // year comes out as undefined ! 
    const year = await Title.find({year})
    res.json({ length: year.length, data: year })
    } else {
      const year = await Title.find()
      res.json({ data: year }) 
    }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})