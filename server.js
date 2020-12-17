import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Director = mongoose.model('Director', {
  name: String,
})

const Title = mongoose.model('Title', {
  title: String,

  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Director'
  }
})

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Director.deleteMany()

    netflixData.forEach(item => {
      const director = new director(item)
       director.save();
    })
  }

  seedDatabase()
}


const port = process.env.PORT || 8080
const app = express()


// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/directors', async (req, res) => {
  const directors = await Director.find()
  res.json(directors)
})

app.get('/directors/:id', async (req, res) => {
  const director = await Director.findById(req.params.id)
  if (director) {
    res.json(director)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }

})

app.get('/directors/:id/titles', async (req, res) => {
  const director = await Director.findById(req.params.id)
  if (director) {
    const titles = await Title.find({ director: mongoose.Types.ObjectId(director.id) })
    res.json(titles)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }
})

app.get('/titles', async (req, res) => {
  const titles = await Title.find().populate('author')
  res.json(titles)
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
