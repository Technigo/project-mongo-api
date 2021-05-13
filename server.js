import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const NetflixTitle = mongoose.model('NetflixTitle', {
  show_id: Number,
  title: {
    type: String,
    lowercase: true
  },
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

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await NetflixTitle.deleteMany()
    netflixData.forEach(async (item) => {
      const newTitle = new NetflixTitle(item)
      await newTitle.save()
    })
  }
  seedDB()
}
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

// Route
app.get('/', (req, res) => {
  res.send('Hello hello hello world')
})

// Route that displays one title, or all titles
app.get('/titles', async (req, res) => {
  const { title } = req.query

  if (title) { // localhost:8080/titles?query=title 
    const titles = await NetflixTitle.find({ title: {
      $regex: new RegExp(title, 'i')
    } })
    res.json(titles)
  } else {
    const titles = await NetflixTitle.find()
    res.json({ length: titles.length, data: titles })
  }
})

app.get('/titles/:id', async (req, res) => {
  const { id } = req.params
  try {
    const findTitle = await NetflixTitle.findOne({ _id: id })
    res.json(findTitle)
  } catch (error) {
    res.status(400).json({ error: 'id not found' })
  }
})

app.get('/titles/title/:title', async (req, res) => {
  const { title } = req.params
  try {
    const findTitle = await NetflixTitle.findOne({ title })
    if (findTitle) {
      res.json(findTitle)
    } else {
      res.status(404).json({ error: 'title not found' }) 
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid titlename' })
  }
})
// $regex: new RegExp(titleName, 'i')
// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
