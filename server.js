/* eslint-disable linebreak-style */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

import exercisesData from './data/exercises.json'

dotenv.config()

// Lines 9-11 connects server and database
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Exercise = mongoose.model('Exercise', {
  exerciseID: Number,
  name: String,
  category: String,
  muscle_group: String,
  target_muscle: String,
  instructions: String,
  img: String
})

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Exercise.deleteMany()

    exercisesData.forEach((exercise) => {
      const newExercises = new Exercise(exercise)
      newExercises.save()
    })
  }
  seedDB()
}

//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// All exercises
app.get('/exercises', (req, res) => {
  Exercise.find().then((exercises) => {
    res.json({ data: exercises })
  })
})

// Queries
app.get('/exercises/:exerciseId', async (req, res) => {
  const { exerciseId } = req.params

  try {
    const singleExercise = await Exercise.findById(exerciseId)
    res.json(singleExercise)
  } catch (error) {
    res.status(404).json({ error: 'Not found', details: error })
  }
})

// Filter exercises by name
app.get('/exercise', async (req, res) => {
  const { name } = req.query

  if (name) {
    const exercises = await Exercise.find({
      name: {
        $regex: new RegExp(name, 'i')
      }
    })
    res.json(exercises)
  } else {
    const exercises = await Exercise.find()
    res.json(exercises)
  }
})

// Find all multi-joint exercises, classic .then()
app.get('/category/multi-joint', (req, res) => {
  Exercise.find({ category: 'multi-joint exercise' }).then((exercise) => {
    res
      .json(exercise)
      .catch((error) => res.status(400).json({ error: 'Not found', details: error }))
  })
})

// Find all single-joint exercises, classic .then()
app.get('/category/single-joint', (req, res) => {
  Exercise.find({ category: 'single-joint exercise' }).then((exercise) => {
    res
      .json(exercise)
      .catch((error) => res.status(400).json({ error: 'Not found', details: error }))
  })
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
