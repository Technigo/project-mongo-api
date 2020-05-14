import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import goldenGlobesData from './data/golden-globes.json'
import Nomination from './models/nominations'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


if (process.env.RESET_DATABASE) {
  console.log('Resetting database ...')
  const seedDatabase = async () => {
    // Clear our database
    await Nomination.deleteMany()
    // Save all of the books from books.json to the database
    await goldenGlobesData.forEach((nomination) => new Nomination(nomination).save())
  }
  seedDatabase()
}

/* new Nominations({
  "year_film": 2009,
  "year_award": 2010,
  "ceremony": 67,
  "category": "Best Motion Picture - Drama",
  "nominee": "Avatar",
  "film": "",
  "win": true
}).save() */

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/nominations', async (req, res) => {
  const { nominee } = req.query
  if (nominee) {
    const queryRegex = new RegExp(nominee, 'i')
    const nominations = await Nomination.find({ nominee: queryRegex })
    console.log(`found ${nominations.length} nominations...`)
    res.json(nominations)
  } else {
    const nominations = await Nomination.find()
    console.log(`found ${Nomination.length} nominations...`)
    res.json(nominations)
  }
})



app.get('/nominations/years/:year', async (req, res) => {
  const { year } = req.params
  const nomination = await Nomination.find({ year_award: year })
  if (nomination) {
    res.json(nomination)
  } else {
    res.status(404).json({ error: `Could not find nominations with id ${year}` })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
