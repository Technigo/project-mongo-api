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
  win: Boolean
})

if (process.env.RESET_DB) {
	const fixedDatabase = async () => {
    await Nomination.deleteMany();
		goldenGlobesData.forEach(item => {
      const newNominations = new Nomination(item);
      newNominations.save();
		})
  }
  fixedDatabase();
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


// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello welcome to my golden globe api!')
})

app.get('/nominees', async (req, res) => {
  
  const getNominations = await Nomination.find(req.query)

  if (getNominations) {
    res.json(getNominations)
  } else {
    res.status(404).json({ error: 'There is no nomination like this'})
  }
})

app.get('/nominees/:year/:category', async (req, res) => {
  const { year, category } = req.params
  let filteredNominees = await Nominee.find(
    { 
      year_award: year, 
      category: category
    })
  res.json(filteredNominees)
})

//ONE ENDPOINT 
app.get('/nominee/:year/:category/win=true', async (req, res) => {
  const { year, category } = req.params
  let filteredNominees = await Nominee.find(
    {
      year_award: year,
      category: category,
      win: true
    });
  if (filteredNominees) {
    res.json(filteredNominees)
  } else {
    res.status(404).json({ error: 'Not found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
