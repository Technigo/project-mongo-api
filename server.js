import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

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

    const chocolate = new Show({
      "title": "Chocolate",
      "director": "",
      "cast": "Ha Ji-won, Yoon Kye-sang, Jang Seung-jo, Kang Bu-ja, Lee Jae-ryong, Min Jin-woong, Kim Won-hae, Yoo Teo",
      "country": "South Korea",
      "date_added": "November 30, 2019",
      "release_year": 2019,
      "rating": "TV-14",
      "duration": "1 Season",
      "listed_in": "International TV Shows, Korean TV Shows, Romantic TV Shows",
      "description": "Brought together by meaningful meals in the past and present, a doctor and a chef are reacquainted when they begin working at a hospice ward.",
      "type": "TV Show"})

    await chocolate.save()
  }

 seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/shows', async (req, res) => {
  const shows = await Show.find()
  res.json(shows)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
