import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/shows"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

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
  descriotion: String,
  type: String
})

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Show.deleteMany()
  
    netflixData.forEach(item => {
      const newShow = new Show(item)
      newShow.save()
    })
  
  }
  seedDatabase()
} 

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello! To see the whole list of show type in /shows')
})

app.get('/shows', async (req, res) => {
  const allShows = await Show.find()
  res.json(allShows)
})

app.get('/shows/:show_id', async (req, res) => {
  const singleShow = await Show.findOne({ show_id: req.params.show_id })

  res.json(singleShow)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
