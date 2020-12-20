import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import harryData from './data/harry-potter-characters.json'

const ERROR_CHARACTERS_NOT_FOUND = {error : 'No character results were found, please try again.'}

//creating the database 
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/characters"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Character = new mongoose.model('Character', {
  //  properties to match the keys from harryData.json
  id: Number,
  name: String,
  gender: String,
  job: String,
  house: String,
  wand: String,
  patronus: String,
  species: String,
  blood_status: String,
  hair_color: String,
  eye_color: String,
  loyalty: String,
  skills: String,
  birth_date: String,
  death_date: String
})

if (process.env.RESET_DATABASE) { // By using the if statement, database will only be reset when writing RESET_DATABASE=true npm run dev in console. 
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Character.deleteMany({}) //To prevent duplication when saving
    harryData.forEach(async characterData => {
      await new Character(characterData).save()
    })
  }
  seedDatabase()
}

// Defines the port the app will run on
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// For connection errors
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({error: 'Service unavailable'})
  }
})

// ROUTES FOR ENPOINTS
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Shows all data from database and lets you query over all parameters, i.e names
app.get('/characters', async (req, res) => {
  const characters = await Character.find(req.query) 
  if (characters.length === 0) {
    res.status(404).json(ERROR_CHARACTERS_NOT_FOUND)
  } else {
    res.json(characters)
  }
})

// Shows one character with a unique id
app.get('/characters/id/:id', async (req, res) => {
  const { id } = req.params
  const singleID = await Character.findOne({ id: id })
  if (singleID) {
    res.json(singleID)
  } else {
    res.status(404).json(ERROR_CHARACTERS_NOT_FOUND)
  }
})

// Shows all characters from a specific house, not case sensitive
app.get('/characters/:house', async (req, res) => {
  const { house } = req.params
  const houses = await Character.find({ house: { $regex: house, $options: "i"} })
  if (houses.length === 0) {
    res.status(404).json(ERROR_CHARACTERS_NOT_FOUND)
  } else {
    res.json(houses)
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
