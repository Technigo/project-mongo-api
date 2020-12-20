import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden when starting the server. For example:
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// This creates a model for what's stored in the db.
// The Nominee variable is the mongoose model. Takes two arguments – the name of the model (String), and the object to base objects off of. A blueprint of sorts.
const Nominee = new mongoose.model('Nominee', {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
})

// We need to start the server with the custom env variable. (See 1:07:41 in Maks' Monday lecture.)
// The command for this is RESET_DATABASE=true npm run dev
if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    // Clear the database
    await Nominee.deleteMany();

    // Re-populate the database
    goldenGlobesData.forEach(item => {
      const newNominee = new Nominee(item)
      newNominee.save()
    })
  }
  populateDatabase()
}

// ⤵ Endpoints start here ⤵
app.get('/', (req, res) => {
  res.send('Hello world')
})

// ⤵ Endpoint that returns all the nominees, ever. Also works as a query param.
app.get('/nominees', async (req, res) => {
  // Whoa! The little "req.query" in the find() function works as a query param. So, you can for example type /nominees?nominee=Kaitlyn%20Dever and learn that Kaitlyn Dever was nominated for "Best Performance by an Actress in a Limited Series or a Motion Picture Made for Television" in 2020, but sadly didn't win (Michelle Williams won).
  const allNominees = await Nominee.find(req.query)
  res.json(allNominees)
})

// ⤵ Endpoint that returns all the winners, ever.
app.get('/nominees/winners', async (req, res) => {
  const winners = await Nominee.find({ win: true })
  res.json(winners)
})

// ⤵ Endpoint that returns all the nominees for all categories in a given year.
app.get('/nominees/:year', async (req, res) => {
  const { year } = req.params
  const filteredNominees = await Nominee.find({ year_award: year })
  res.json(filteredNominees)
})

// ⤵ Endpoint that returns all the nominees of a category given a specific year.
app.get('/nominees/:year/:category', async (req, res) => {
  const { year, category } = req.params
  let filteredNominees = await Nominee.find(
    { 
      year_award: year, 
      category: category
    })
  res.json(filteredNominees)
})

// ⤵ Endpoint that returns the winner of a category given a specific year.
app.get('/nominees/:year/:category/winner', async (req, res) => {
  const { year, category } = req.params
  // These are the properties we're filtering on. All three in one go, yeeeah!
  let filteredNominees = await Nominee.find(
  { 
    year_award: year, 
    category: category, 
    win: true 
  })
  res.json(filteredNominees)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
