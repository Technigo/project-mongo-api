import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-api"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service is currently unavailable.' })
  }
})

const NetflixCatalogue = mongoose.model('Netflix Catalogue', {
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

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/catalogue/id/:netflixId', async (req, res) => {
  try {
    const { netflixId } = req.params
    const titleId = await NetflixCatalogue.findById(netflixId)
  
    if (titleId) {
      res.json({
        response: titleId,
        success: true,
      })
    } else {
      res.status(404).json({
        response: 'No title by that ID was found.',
        success: false,
      })
    } 
  } catch (err) {
    res.status(400).json({ error: 'Invalid title ID' })
  }
})

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
