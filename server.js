import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import expressListEndpoints from 'express-list-endpoints'
import dogsData from './data/dogs.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/dogs'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const Dog = mongoose.model('Dog', {
  id: Number,
  name: String,
  breed: String,
  age: Number,
  color: String,
  weight_kg: Number,
  likes_toys: Boolean,
})
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Dog.deleteMany({})

    dogsData.forEach((dog) => {
      new Dog(dog).save()
    })
  }

  seedDatabase()
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})
app.get('/dogs', async (req, res) => {
  let query = {}
  if (req.query.breed) {
    query.breed = req.query.breed
  }
  if (req.query.age) {
    query.age = req.query.age
  }
  if (req.query.weight_kg) {
    query.weight_kg = req.query.weight_kg
  }
  if (req.query.color) {
    query.color = req.query.color
  }

  try {
    const dogs = await Dog.find(query)
    res.json(dogs)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/dogs/:id', async (req, res) => {
  const dog = await Dog.findById(req.params.id)
  res.json(dog)
})
app.post('/dogs', async (req, res) => {
  try {
    const newDog = req.body
    const createdDog = await Dog.create(newDog)
    res.status(201).json(createdDog)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create dog' })
  }
})
app.put('/dogs/:id', async (req, res) => {
  try {
    const { age, weight_kg } = req.body
    const updatedDog = await Dog.findByIdAndUpdate(
      req.params.id,
      { age, weight_kg },
      { new: true } //this returns the updated document
    )

    if (!updatedDog) {
      return res.status(404).json({ error: 'Dog not found' })
    }

    res.json(updatedDog)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update dog' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
