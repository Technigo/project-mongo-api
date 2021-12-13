/* eslint-disable max-len */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

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
app.use(express.json())

// Making a model of the Netflix-Data for the DB
const NetflixEntry = mongoose.model('NetflixEntry', {
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
})

// seeding the DB only when typing this RESET_DB-variable in the Terminal. Should only be used, when you are setting a project up. Otherwise alll Userdata is gone!!!
// $ RESET_DB=true npm run dev
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await NetflixEntry.deleteMany() // deletes all content from the DB

    netflixData.forEach((item) => new NetflixEntry(item).save())
  }
  seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
