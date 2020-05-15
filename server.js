import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import data from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/nominations"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.promise = Promise

// MODEL
const Nomination = mongoose.model('Nomination', {
  year_film: { type: Number },
  year_award: { type: Number },
  ceremony: { type: Number },
  category: { type: String },
  nominee: { type: String },
  film: { type: String },
  win: { type: Boolean }
})

// RESETTING AND SEEDING DATABASE
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

// MIDDLEWARES
app.use(cors())
app.use(bodyParser.json())

// CHECKS IF SERVICE IS AVAILABLE
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1 || 2) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// ROUTES
app.get('/', (req, res) => {
  res.send('Welcome to the Golden Globes API. Possible endpoints: /nominations (possible queries: category, nominee and film), /nominatons/id/:id, /nominations/:year_award (possible query: win=true), /nominations/category/:category (possible query: win=true), /nominations/category/:category/year/:year (possible query: win=true)')
})

//SHOWS ALL THE NOMINATIONS
app.get('/nominations', async (req, res) => {
  const { category, nominee, film } = req.query

  // POSSIBLE QUERIES: CATEGORY, NOMINEE & FILM
  const showNominations = await Nomination.find({
    category: new RegExp(category, 'i'),
    nominee: new RegExp(nominee, 'i'),
    film: new RegExp(film, 'i'),
  })

  if (showNominations) {
    res.json(showNominations)
  } else {
    res.status(404).json({ error: 'Error in search' })
  }
})

// SHOW NOMINATION BY ID
app.get('/nominations/id/:id', async (req, res) => {
  const nominations = await Nomination.findById(req.params.id)
  res.json(nominations)
})

// SHOW ALL NOMINATIONS IN A YEAR
app.get('/nominations/:year_award', async (req, res) => {
  const { year_award } = req.params
  let yearNominations = await Nomination.find({ year_award: year_award })

  // FILTER THE NOMINATIONS IN A YEAR TO ONLY SHOW THE ONES WHO WON
  const showWin = req.query.win

  if (showWin && yearNominations) {
    yearNominations = yearNominations.filter((item) => item.win === true)
  }
  res.json(yearNominations)

  if (yearNominations) {
    res.json(yearNominations)
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

// SHOW ALL THE NOMINATION IN A SPECIFIC CATEGORY - E.G.: DRAMA, COMEDY, BEST DIRECTOR, SUPPORTING ROLE ETC.
app.get('/nominations/category/:category', async (req, res) => {
  const nominations = await Nomination.find()
  const nominationCategory = req.params.category
  const showCategoryWin = req.query.win

  let categories = nominations.filter((item) => item.category.includes(nominationCategory))

  // FILTER A SPECIFIC CATEGORY BY WINS
  if (showCategoryWin && categories) {
    categories = categories.filter((item) => item.win === true)
  }
  res.json(categories)

  if (categories) {
    res.json(categories)
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

// SHOW A SPECIFIC CATEGORY AND A SPECIFIC YEAR
app.get('/nominations/category/:category/year/:year', async (req, res) => {
  const nominations = await Nomination.find()
  const nominationCategory = req.params.category
  const year = req.params.year
  const showWins = req.query.win

  let categories = nominations.filter((item) => item.category.includes(nominationCategory))

  // POSSIBLE TO FILTER TO SHOW ONLY WINS
  if (showWins && categories && year) {
    let wonCategories = categories.filter((item) => item.win === true)
    wonCategories = wonCategories.filter((item) => item.year_award === +year)
    res.json(wonCategories)
  } else if (categories && year) {
    const yearCategories = categories.filter((item) => item.year_award === +year)
    res.json(yearCategories)
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})