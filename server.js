import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import ceremonies from './data/golden-globes.json'


// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 

// import avocadoSalesData from './data/avocado-sales.json'
/* import booksData from './data/books.json' */
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const ceremonySchema = new mongoose.Schema ({
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
})

const Ceremony = mongoose.model('Ceremony', ceremonySchema)

const seedDB = () => {
  ceremonies.forEach(item => {
    const newCeremony = new Ceremony(item)
    newCeremony.save()
  })
}
  seedDB()


const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hola world')
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
