import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose, { MongooseDocument } from 'mongoose'
import { stringify } from 'querystring'
import netflixData from './data/netflix-titles.json'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/shows"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


  const Show = mongoose.model('Show', {
    showID:{
      type: Number,
    },
    title: {
      type: String,
    },
    directors: {
      type: String,
    },
    cast: {
      type: String,
    },
    country: {
      type: String,
    },
    date_added: {
      type: String,
    },
    release_year: {
      type: Number,
    },
    rating: {
      type: String,
    },
    duration: {
      type: String,
    },
    listed_in: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
    },
  })

  if (process.env.RESET_DATABASE) {
    console.log('Resetting database!')
    
    const seedDatabase = async () => {
    
      await Show.deleteMany()

      await netflixData.forEach((show) => new Show(show).save())
    
    }
  seedDatabase()
  }


const port = process.env.PORT || 5000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/shows', async (req, res) => {
  const { query } = req.query
   if (query) {
    //localhost:5000/shows?query=Movie 
    const queryRegex = new RegExp(query, 'i')
    const shows = await Show.find({ type: queryRegex })
    res.json(shows)
   } else {
    //localhost:5000/shows
    const shows = await Show.find();
    res.json(shows)
   }
 })

app.get('/shows/:title', async (req, res) => {
  const { title } = req.params
  const show = await Show.findOne({ title: title })
  if (show) {
    res.json(show)
  } else {
    res.status(404).json({ error: `Could not find show with title=${title}` })
  }
})

app.get('/shows/year/:release_year', async (req, res) => {
  const { release_year } = req.params
  const year = await Show.find({ release_year: release_year })
  if (year) {
    res.json(year)
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

app.get('/shows/country/:country', async (req, res) => {
  const { country } = req.params
  const whatCountry = await Show.find({ country: country })
    res.json(whatCountry)

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
