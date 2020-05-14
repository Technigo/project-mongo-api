import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import showData from './data/netflix-titles.json'
import { Shows } from './models'

const dotenv = require('dotenv')
dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const path = require('path')
const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/public/index.html'))
})

app.get('/shows', async (req, res) => {   
  const { title, year, country, actor } = req.query
  let myFilter = {}

  if (title) {
    myFilter['title'] = new RegExp(`${title}`, 'i')
  }
  
  if (year) {
    myFilter['release_year'] = year;
  }

  if (country) {
    myFilter['country'] = new RegExp(`${country}`, 'i')
  }

  if (actor) {
    myFilter['cast'] = new RegExp(`${actor}`, 'i')
  }
  
  const show = await Shows.find(myFilter).collation({ locale: 'en_US', strength: 1 });
  
  const page = +(req.query.page ?? 1)
  const pageSize = +(req.query.pageSize ?? 20)
  const startIndex = (page -1) * pageSize
  const endIndex = startIndex + pageSize 
  const filteredShows = show.slice(startIndex, endIndex)
  const returnObject = { 
    pageSize: pageSize,
    page: page,
    maxPages: Math.ceil(show.length/pageSize),
    totalShows: show.length,
    results: filteredShows
  }

  if (returnObject.results.length === 0) {
    res.json("No results to show")
  } else {
    res.json(returnObject)
  }
})

app.get('/shows/:id', async (req, res) => {
  
  const show = await Shows.findOne({ show_id: req.params.id })
  
  if (show) {
    res.json(show)
  } else {
    res.status(404).json({ error: `This show does not exist!`})
  }
})

app.get('/categories', async (req, res) => {
  let categories = []

  const show = await Shows.find()
  
  await show.forEach((item) => {
    if (!categories.includes(item.type)) {
      categories.push(item.type)
    } else return
  })

  res.json(categories)

})

app.get('/categories/:category', async (req, res) => {
  const { category } = req.params

  const categoryFind = await Shows.find( { type: category } ).collation({ locale: 'en_US', strength: 1 })
  
  const page = +(req.query.page ?? 1)
  const pageSize = +(req.query.pageSize ?? 20)
  const startIndex = (page -1) * pageSize
  const endIndex = startIndex + pageSize 
  const filteredCategory = categoryFind.slice(startIndex, endIndex)
  const returnObject = { 
    pageSize: pageSize,
    page: page,
    maxPages: Math.ceil(categoryFind.length/pageSize),
    totalShows: categoryFind.length,
    results: filteredCategory
  }

  if (categoryFind.length === 0) {
    res.json(`There is no category named ${req.params.category}`)
  } else {
    res.json(returnObject)
  }
})

app.use((req, res, next) => { // if server is unavailable

  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable"})
  }
})

app.use((req,res,next) => {
  res.status(404).json({error: `No path ${req.path}`})
})

if (process.env.RESET_DB) {
	const seedDatabase = async () => {
    await Shows.deleteMany({})

		showData.forEach((show) => {
      const splitCast = show.cast.split(", ")
      show.cast = splitCast

      if (show.director === "") {
        show.director = "Unknown"
      } else {
        const splitDirectors = show.director.split(", ")
        show.director = splitDirectors
      }

      if (show.country === "") {
        show.country = "Unknown"
      } else {
         const splitCountry = show.country.split(", ")
         show.country = splitCountry
      }
  
			new Shows(show).save()
		})
  }

  seedDatabase()
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
