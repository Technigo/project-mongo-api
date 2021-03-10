import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Nomination = new mongoose.model('Nomination', {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean, 
})

if (process.env.RESET_DATABASE) {

  const populateDatabase = async () => {
    await Nomination.deleteMany();

    goldenGlobesData.forEach(item => {
      const newNomination = new Nomination(item)
      newNomination.save()
    })
  }
  populateDatabase()
}


// Defines the port the app will run on. brew
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello Claudia')
})

//Returns all the nominations 
//2 
app.get('/nominations', async (req, res) => {
  const allNominations = await Nomination.find(req.query)
  if (allNominations) {
    res.json(allNominations)
  } else {
    res.status(404).json({ error: 'Not found'})
  }
})

//Returns all the nominations for a specific movie or actor 
// 3
app.get('/nominations/:nominee', async (req, res) => {
  const oneNominee = await Nomination.find({ nominee: req.params.nominee });
  if (oneNominee) {
    res.json(oneNominee)
  } else {
    res.status(404).json({ error: 'Nominee not found' })
  }
})
// Returns all winners:
app.get('/nominations?win=true', async (req, res) => {
  const winners = await Nomination.find({ win: true })
  if (winners) {
    res.json(winners)
  } else {
    res.status(404).json({ error: 'Winners not found' })
  }
})

// Returns winner (specific year and category)
app.get('/nominations/:year/:category/win=true', async (req, res) => {
  const { year, category } = req.params
  let filteredNominees = await Nomination.find(
    {
      year_award: year,
      category: category,
      win: true
    })
  if (filteredNominees) {
    res.json(filteredNominees)
  } else {
    res.status(404).json({ error: 'ERROR' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
