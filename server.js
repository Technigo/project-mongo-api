import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose, { connection } from 'mongoose'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const Show = mongoose.model('Show', {
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
  type: String
})

if (process.env.RESET_DATABASE){
  const seedDatabase = async () => {
    console.log("Resetting database")
    await Show.deleteMany()

    netflixData.forEach((showData) => {
      new Show(showData).save()
    })
  }

 seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1){
    next()
  } else {
    res.status(503).json({error: 'Service unavailable'})
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/shows', async (req, res) => {
  const shows = await Show.find()
  res.json(shows)
})

app.get('/shows/:id', async (req, res) => {
  const {id} = req.params
 try { 
  const singleShow = await Show.findOne({show_id: id})
  if(singleShow){  
    res.json(singleShow)
  } else {
    res.status(404).json({error: "Show not found"})
  }
} catch (err) {
  res.status(400).json({error: "Invalid ID"})
}

})

app.get('/shows/year/:year', async (req, res) => {
  const {year} = req.params
 try { 
  const filteredOnYears = await Show.find({release_year: year})
  if(filteredOnYears){  
    res.json(filteredOnYears)
  } else {
    res.status(404).json({error: "Show not found"})
  }
} catch (err) {
  res.status(400).json({error: "Invalid ID"})
}

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
