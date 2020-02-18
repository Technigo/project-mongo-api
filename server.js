import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/globes"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// setup mangoose models
const Category = mongoose.model('Category', {
  name: String
})

const Movie = mongoose.model('Movie', {
  title: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
})

const seedDatabase = async () => {
  await Category.deleteMany()
  await Movie.deleteMany()

  const cat = new Category({ name: 'Best movie of XX century' })
  await cat.save()

  const mov = new Movie({ title: 'Rejs (English title - The Cruise)', category: cat })
  await mov.save()
}

seedDatabase()

// ports
const port = process.env.PORT || 8080
const app = express()

// middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// routes 

app.get('/', (_, res) => {
  res.send('Second backend project')
})

app.get('/categories', async (_, res) => {
  res.json(await Category.find())
})

app.get('/titles', async (_, res) => {
  res.json(await Movie.find().populate('category'))
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
