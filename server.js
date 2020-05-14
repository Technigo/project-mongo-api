import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import data from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/nominations"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.promise = Promise

const Nomination = mongoose.model('Nomination', {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
})

if (process.env.RESET_DB) {
  console.log('Resetting database!')
  const seedDatabase = async () => {
    await Nomination.deleteMany()

    data.forEach((nominationData) => {
      new Nomination(nominationData).save()
    })
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

app.use((req, res, next) => {
  if(mongoose.connection.readyState === 1 || 2) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

//Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/nominations', async (req, res) => {
  let nominations = await Nomination.find()

  const nominee = req.query.nominee
  // You can look for a specific nominee: http://localhost:8080/nominations?nominee=Homeland

  if(nominee) {
    nominations = nominations.filter((item) => item.nominee === nominee)
  }
    res.json(nominations)
})

app.get('/nominations/id/:id', async (req, res) => {
  const nominations = await Nomination.findById(req.params.id)
  res.json(nominations)
})

app.get('/nominations/:year_award', async (req, res) => {
  const { year_award } = req.params
  let yearNominations = await Nomination.find({ year_award: year_award })

  const showWin = req.query.win

  if(showWin && yearNominations) {
    yearNominations = yearNominations.filter((item) => item.win === true)
  }
  res.json(yearNominations)

  if (yearNominations) {
    res.json(yearNominations)
  } else {
    res.status(404).json({ error: 'Not found'})
  }
})

app.get('/nominations/category/:category', async (req, res) => {
  const nominations = await Nomination.find()
  const nominationCategory = req.params.category
  const showCategoryWin = req.query.win

  let categories = nominations.filter((item) => item.category.includes(nominationCategory))

  if (showCategoryWin && categories) {
    categories = categories.filter((item) => item.win === true)
  }
  res.json(categories)

  if (categories) {
    res.json(categories)
  } else {
    res.status(404).json({ error: 'Not found'})
  }
})

app.get('/nominations/category/:category/year/:year', async (req, res) => {
  const nominations = await Nomination.find()
  const nominationCategory = req.params.category
  const year = req.params.year
  const showWins = req.query.win

  let categories = nominations.filter((item) => item.category.includes(nominationCategory))

  if (showWins && categories && year) {
    let wonCategories = categories.filter((item) => item.win === true)
    wonCategories = wonCategories.filter((item) => item.year_award === +year)
    res.json(wonCategories)
  } else if (categories && year) {
    const yearCategories = categories.filter((item) => item.year_award === +year)
    res.json(yearCategories)
  } else {
    res.status(404).json({ error: 'Not found'})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})