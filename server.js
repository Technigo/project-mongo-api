import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/netflix-titles'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Director = mongoose.model('Director', {
  name: String
})

const Title = mongoose.model('Title', {
  title: String,
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Director'
  }
})

const seedDatabase = async () => {
  await Director.deleteMany()
  await Title.deleteMany()

  const ara = new Director({ name: 'Luis Ara' })
  await ara.save()

  const sharma = new Director({ name: 'Abhishek Sharma' })
  await sharma.save()

  await new Title({
    title: 'Guatemala: Heart of the Mayan World',
    director: ara
  }).save()
  await new Title({
    title: 'The Zoya Factor',
    director: sharma
  }).save()
}

seedDatabase()

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Routes
app.get('/directors', async (req, res) => {
  const directors = await Director.find()
  res.json(directors)
})

app.get('/directors/:id', async (req, res) => {
  try {
    const director = await Director.findById(req.params.id)
    if (director) {
      res.json(director)
    } else {
      res.status(404).json({ error: 'Director not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid director id' })
  }
})

app.get('/directors/:id/titles', async (req, res) => {
  try {
    const director = await Director.findById(req.params.id)
    if (director) {
      const titles = await Title.find({
        director: mongoose.Types.ObjectId(director.id)
      })
      res.json(titles)
    } else {
      res.status(404).json({ error: 'Director not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid director id' })
  }
})

app.get('/titles', async (req, res) => {
  const titles = await Title.find().populate('director')
  res.json(titles)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
