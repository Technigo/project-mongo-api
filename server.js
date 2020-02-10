import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import { Plant } from './models/plants'
import { Family } from './models/family'

const mongoUrl = process.env.MONGO_URL || "mongodb+srv://dbUserClara:dbUserClara1@cluster0-mtwpn.mongodb.net/mongoprojectplants?retryWrites=true&w=majority"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


if (process.env.RESET_DB) {
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Plant.deleteMany()
    await Family.deleteMany()

    const flowers = new Family({
      name: 'Flowers',
      members: 21,
      color: 'orange',
      location: 'Africa'
    })
    await flowers.save()

    const fungi = new Family({
      name: 'Fungi',
      members: 10,
      color: 'green',
      location: 'Europe'
    })
    await fungi.save()

    const algae = new Family({
      name: 'Algae',
      members: 33,
      color: 'brown',
      location: 'Pacific Ocean'
    })
    await algae.save()

    const greenalgae = new Plant({
      name: 'Green Algae',
      type: 'water algae',
      isEdible: true,
      team: algae
    })
    await greenalgae.save()

    const lily = new Plant({
      name: 'Lily of the Valley',
      type: 'Seed Plant',
      isEdible: false,
      team: flowers
    })
    await lily.save()

    const truffle = new Plant({
      name: 'Truffle',
      type: 'Wild fungi',
      isEdible: true,
      team: fungi
    })
    await truffle.save()

  }
  seedDatabase()
}

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
  const plants = await Plants.find().populate('team')
  res.json(plant)
})

app.get('/plants/:id/', async (req, res) => {
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
