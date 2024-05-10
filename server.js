import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
//import dotenv from 'dotenv'
import expressListEndpoints from 'express-list-endpoints'
import questionData from './data/Jeopardy.json'
import Questions from './model/questionSchema'

//dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const seedDatabase = async () => {
  await Questions.deleteMany()
  questionData.forEach((question) => {
    new Questions(question).save()
  })
}
seedDatabase()

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

app.route('/').get((req, res) => {
  const endpoints = expressListEndpoints(app)
  res.send(endpoints)
})

app.get('/questions', async (req, res) => {
  const questions = await Questions.find()
  if (questions) {
    res.json(questions)
  } else {
    res.status(404).json({ error: 'Could not find any Questions' })
  }
})
app.get('/question/:id', async (req, res) => {
  const id = await Questions.findOne({ id: req.params.id })
  if (id) {
    res.json(id)
  } else {
    res
      .status(404)
      .json({
        error:
          'Could not find a question with this id, the id:s go from 0 - 424',
      })
  }
})

app.get('/category/:category', async (req, res) => {
  const category = await Questions.find({ category: req.params.category })
  if (category) {
    res.json(category)
  } else {
    res
      .status(404)
      .json({
        error:
          'Could not find this category, try endpoints like: /Sport, /Swiss Cheese Fondue, /Japan or /Beyoncé',
      })
  }
})

app.get('/difficulty/:difficulty', async (req, res) => {
  const difficulty = await Questions.find({ difficulty: req.params.difficulty })
  if (difficulty) {
    res.json(difficulty)
  } else {
    res
      .status(404)
      .json({
        error:
          'Could not find any questions of this difficulty level, try /Easy or /Medium or /Hard',
      })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
