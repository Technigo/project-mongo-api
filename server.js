import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import profanityData from './data/profanity-dictionary.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/profanity"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// defining models, this is the blueprint to create new instances of models
// this is the schema
const Profanity = new mongoose.model('Profanity', {
  id: Number,
  word_phrase: String,
  literal_english_translation: String,
  category_id: Number,
  category: String,
  language: String
})


// clear database and populate it with the data
// using async function
// reach the database, clear it, populate it
if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Profanity.deleteMany()

    profanityData.forEach(item => {
      const newProfanity = new Profanity(item)
      newProfanity.save(function (err, item) {
        if (err) return console.error(err);
      })
    })
  }
  populateDatabase()
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
  res.send('Hello world')
})

// restful endpoint to entire database
// has to use async and await since lines of code has to be
// executed in specific order
// queries 
app.get('/profanities', async (req, res) => {
  const allProfanities = await Profanity.find(req.query)
  res.json(allProfanities)
})

// restful endpoint to one single element of database
// returns one object from the database
app.get('/profanities/:id', async (req, res) => {
  const singleProfanity = await Profanity.findOne({ id: req.params.id })
  res.json(singleProfanity)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
