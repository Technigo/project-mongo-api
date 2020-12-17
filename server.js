import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/productions"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Production = mongoose.model('Production', {
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

//command: RESET_DATABASE=true npm run dev
if (process.env.RESET_DATABASE) {
  console.log('resetting database!')
  const populateDatabase = async () => {
    await Production.deleteMany();
  
    netflixData.forEach(item => {
      const newProduction = new Production(item);
      newProduction.save();
    })
  }
  populateDatabase();
}


const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Global Error if problem with the database
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else { 
    res.status(503).json({ error: 'Service not available' })
  }
})

// ROUTES
app.get('/', (req, res) => {
    res.send('API NeflixData - Powered by: Moa Blomkvist')
  })

// One array of data
app.get('/productions', async (req, res) => {
  const allProductions = await Production.find()
  res.json(allProductions)
})

// One object of data (findById)
app.get('/productions/:id', async (req, res) => {
  try {
    const production = await Production.findById(req.params.id)
    if (production) {
      res.json(production)
    } else {
      res.status(404).json({ error: 'Production not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid production id' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
