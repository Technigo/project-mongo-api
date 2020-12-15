import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

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
  // Profanity.find().then(profanities => {
  //   res.json(profanities)
  // })
})

// restful path to database
// app.get('/profanities', async (req, res) => {
//   const profanities = await Profanity.find()
//   res.json(profanities)
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
