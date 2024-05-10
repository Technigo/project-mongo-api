import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import expressListEndpoints from 'express-list-endpoints'
import questionData from './data/Questions.json'
import Questions from './model/questionSchema'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

// Set the data and refresh the data
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Questions.deleteMany()

    questionData.forEach((question) => {
      new Questions(question).save()
    })
  }
  seedDatabase()
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  const endpoints = expressListEndpoints(app).map(endpoint => {
    // Add alive query parameter to the '/artists/:name' endpoint
    if (endpoint.path === '/questions') {
      endpoint.query = [{
        parameter: "page",
        description: "add query endpoint to /questions, to show different pages. 50 questions per page",
        type: "number",
        example: "?page=7"
      }];
    }
    return endpoint;
  });

  res.json(endpoints);
})

//Endpoint for all the questions
app.get('/questions', async (req, res) => {
  const page = parseInt(req.query.page) || 1 //Defaults to page 1 if invalid
  const limit = 50 //Display 50 questions per page
  const skip = (page - 1) * limit //Calc the number of questions to skip for current page

  try {
    const questions = await Questions.find().skip(skip).limit(limit)

    if (questions.length > 0) {
      res.json(questions)
    } else {
      res
        .status(404)
        .send(
          'Could not find any Questions. Try writing /questions. You can also add the page, like e.g. ?page=7'
        )
    }
  } catch (error) {
    console.error('Error fetching Questions', error)
    res.status(500).send('Internal Server Error')
  }
})

//Endpoint for specific ID
app.get('/question/:id', async (req, res) => {
  const id = await Questions.findOne({ id: req.params.id })
  if (id.length > 0) {
    res.json(id)
  } else {
    res.status(404).json({
      error: 'Could not find a question with this id, the id:s go from 0 - 500',
    })
  }
})

//Endpoint for all the questions of a certain category
app.get('/category/:category', async (req, res) => {
  const category = await Questions.find({ category: req.params.category })
  if (category.length > 0) {
    res.json(category)
  } else {
    res.status(404).json({
      error:
        'Could not find this category, try endpoints like e.g. /Sport, /Swiss Cheese Fondue, /Japan, /Beyoncé, /Astronomy',
    })
  }
})

//Endpoint for all the questions of a certain difficulty level
app.get('/difficulty/:difficulty', async (req, res) => {
  const difficulty = await Questions.find({ difficulty: req.params.difficulty })
  if (difficulty.length > 0) {
    res.json(difficulty)
  } else {
    res.status(404).json({
      error:
        'Could not find any questions of this difficulty level, try /Easy or /Medium or /Hard',
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
