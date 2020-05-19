import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import goldenGlobesData from './data/golden-globes.json'
import Nomination from './models/nominations'
import dotenv from 'dotenv'

dotenv.config()

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
    await Nomination.deleteMany()
    await goldenGlobesData.forEach((nomination) => new Nomination(nomination).save())
  }
  seedDatabase()
}


app.get('/', (req, res) => {
  res.send('Welcome to the golden globes nominations API.')
})

app.get('/nomination', async (req, res) => {
  const { id } = req.query
  if (id) {
    const nomination = await Nomination.find({ _id: id })
    res.json(nomination)
  } else {
    res.status(404).json({ error: `Could not find nominations with id ${id}` })
  }
})

app.get('/nominations', async (req, res) => {
  const { nominee, category, win, year } = req.query
  const { page } = req.query || 1
  const PAGE_SIZE = 20
  if (nominee) {
    const queryRegex = new RegExp(nominee, 'i')
    const nominations = await Nomination.find({ nominee: queryRegex })
    res.json(nominations)
  } else if (category) {
    const queryRegex = new RegExp(category, 'i')
    const nominations = await Nomination.find({ category: queryRegex })
    res.json(nominations)
  } else if (win) {
    console.log(win)
    const nominations = await Nomination.find({ win })
    res.json(nominations)
  } else if (year) {
    const nominations = await Nomination.find({ year_award: year })
    res.json(nominations)
  } else if (page) {
    const nominations = await Nomination.find().limit(PAGE_SIZE).skip(PAGE_SIZE * page - PAGE_SIZE)
    res.json(nominations)
  } else {
    const nominations = await Nomination.find()
    res.json(nominations)
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
