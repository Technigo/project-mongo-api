import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { Plant } from './models/plants'
import { Family } from './models/family'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-plants"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/plants', async (req, res) => {
  const plants = await Plants.find().populate('family')
  res.json(plant)
})

app.get('plants/:id/', async, (req, res) => {
  const plant = await Plant.findById(req.params.id)
  if (plant) {
    res.json(plant)
  } else {
    res.status(404).json({ error: 'plant not found' })
  }
})

app.get('/families/', async (req, res) => {
  const membersAbove = req.query.members

  const families = membersAbove
    ? await Family.find({ members: { $gte: membersAbove } })
    : await Family.find()

  if (families.length) {
    console.log(families)
    res.json(families)
  } else {
    res.status(404).json({ error: 'No families found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
