import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'


import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Netflixtitle = mongoose.model('Netflixtitle', {
  show_id: {
    type: Number,
  },
  title: {
    type: String,
  },
  director: {
    type: String,
  },
  cast: {
    type: String,
  },
  country: {
    type: String,
  },
  date_added: {
    type: String,
  },
  release_year: {
    type: Number,
  },
  rating: {
    type: String,
  },
  duration: {
    type: String,
  },
  listed_in: {
    type: String,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
  },

});

if (process.env.RESET_DATABASE) {
console.log('Resettnig database...')

const seedDatabase = async () => {
  // clear out database
  await Netflixtitle.deleteMany();
  // save all of the title from netflixData.json to the database
  await netflixData.forEach((title) => new Netflixtitle(title).save()) 
};
seedDatabase();

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
  netflixData.find().then(titles => {
    res.json(titles)
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
