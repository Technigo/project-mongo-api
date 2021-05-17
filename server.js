/* eslint-disable linebreak-style */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

import exercisesData from './data/exercises.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const exerciseSchema = new mongoose.Schema({
  exerciseID: Number,
  name: String,
  category: String,
  muscle_group: String,
  target_muscle: String,
  instructions: String,
  img: String
})

const Exercise = mongoose.model('Exercise', exerciseSchema)

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

const port = process.env.PORT || 8080
const app = express()

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

// Find exercise by id
app.get('/exercises/:exerciseId', async (req, res) => {
  const { exerciseId } = req.params

  try {
    const singleExercise = await Exercise.findById(exerciseId)
    res.json(singleExercise)
  } catch (error) {
    res.status(404).json({ error: 'Not found', details: error })
  }
})

// Search exercises by name and target muscle
app.get('/exercise', async (req, res) => {
  const { name, targetMuscle } = req.query

  const exercise = await Exercise.aggregate([
    {
      $match: {
        name: {
          $regex: new RegExp(name || "", "i")
        },
        target_muscle: {
          $regex: new RegExp(targetMuscle || "", "i")
        }
      }
    }
  ])
  res.json(exercise)
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
