import express, { response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const netflixSchema = mongoose.Schema({
  title: String,
  director: String,
  cast: String,
  country: String,
  listed_in: String,
  release_year: Number,
  description: String,
  duration: String,
})

const NetflixData = mongoose.model('NetflixData', netflixSchema)

if (process.env.RESET_DB) {
  console.log('SEEDING');
  const seedDB = async () => {
    await NetflixData.deleteMany();
    await netflixData.forEach(item => {
      new NetflixData(item).save()
    })
  }
  seedDB();
}
// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())



// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello from the other side! 🎶')
})

app.get('/content', async (req, res) => {
  let data
  const { country } = req.query
  const { genre } = req.query
  const { releaseYear } = req.query
  const { title } = req.query
  const { director } = req.query
  const { cast } = req.query

  try {
    if (country) {
      data = await NetflixData.find({ 
        country: { $regex: country, $options: "i" } 
      })
    } else if (genre) {
      data = await NetflixData.find({ 
        listed_in: { $regex: genre, $options: "i" }
      })
    } else if (releaseYear) {
      data = await NetflixData.find({ release_year: releaseYear })
    } else if (title) {
      data = await NetflixData.find({ 
        title: { $regex: title, $options: "i" }
      })
    } else if (director) {
      data = await NetflixData.find({ 
        director: { $regex: director, $options: "i" }
      })
    } else if (cast) {
      data = await NetflixData.find({ 
        cast: { $regex: cast, $options: "i" }
      })
    } else {
      data = await NetflixData.find()
    }
    res.json(data)
  } catch (error) {
    res.status(400).json({ error: 'Oops, no luck with that search', details: error })
  }
})

// res.status(404).send({ error: 'Oops, no results for your search'})

app.get('/content/series', async (req, res) => {
  const data = await NetflixData.find({ type: 'TV Show'})
  res.json(data)
})

app.get('/content/movies', async (req, res) => {
  const data = await NetflixData.find({ type: 'Movie'})
  res.json(data)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port} WOOP WOOP 🚀`)
})