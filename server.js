import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/hannas-project-mongo"
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

// set up models (Schema) (define what type of data)
const NetflixTitle = new mongoose.model('NetflixTitle', {
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


//Populate the database
if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await NetflixTitle.deleteMany(); //main rule: clean database before populating database.

    netflixData.forEach(item => {
      const newNetflixTitle = new NetflixTitle(item); // item is a single object from the json array.
      newNetflixTitle.save();
    })
  }
  populateDatabase();
}
// Start defining your routes here
app.get('/netflix-titles', async (req, res) => {
  //res.json(netflixData);
  const allTitles = await NetflixTitle.find();
  res.json(allTitles);
})

app.get('/netflix-titles/:title', async (req, res) => {
  const singleTitle = await NetflixTitle.findOne({ title: req.params.title })
  res.json(singleTitle)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
