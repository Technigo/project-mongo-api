/* eslint-disable linebreak-style */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import exercisesData from './data/exercises.json'

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

Exercise.deleteMany().then(() => {
  new Exercise({
    exerciseID: 112,
    name: 'testing',
    category: 'testing',
    muscle_group: 'testing',
    target_muscle: 'testing',
    instructions: 'testing',
    img: 'testing'
  }).save()
})

//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  Exercise.find().then((exercises) => {
    res.json(exercises)
  })
})

app.get('/:name', (req, res) => {
  Exercise.findOne({ name: req.params.name }).then((exercise) => {
    if (exercise) {
      res.json(exercise)
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  })
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
