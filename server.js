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
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// set up models (Schema) (define what type of data)
// you could put all models in a models-folder also.
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
if (process.env.RESET_DATABASE) { // environment variable used to reset the database
  const seedDatabase = async () => {
    await NetflixTitle.deleteMany(); //main rule: clean database before populating database.

    netflixData.forEach(item => {
      const newNetflixTitle = new NetflixTitle(item); // item is a single object from the json array.
      newNetflixTitle.save();
    })
  }
  seedDatabase();
}

//ENDPOINT TO GET ALL TITLES: '/netflix-titles'
//QUERY-PARAM TO GET ONE TITLE BY TITLE-NAME: /netflix-titles?title=American 
//QUERY-PARAM TO GET DIRECTOR: /netflix-titles?director=nate
//Query-PARAM TO GET ACTOR: /netflix-titles?actor=niro
//Query-PARAM TO GET TITLES BY TYPE: /netflix-titles?type=tv
//Query-PARAM TO GET TITLES FROM COUNTRY: /netflix-titles?country=germany
//EXAMPLE TO FIND TITLE(S) BY DIRECTOR & ACTOR /netflix-titles?actor=niro&director=scorsese
app.get('/netflix-titles', async (req, res) => {
  const { title, director, actor, type, country } = req.query;
  const allTitles = await NetflixTitle.find({
    title: new RegExp(title, 'i'), //regexp: 'i' is 'ignore case'
    director: new RegExp(director, 'i'),
    cast: new RegExp(actor, 'i'),
    type: new RegExp(type, 'i'),
    country: new RegExp(country, 'i')
  })
    .sort({ release_year: -1 }); //sort desc.
  if (allTitles.length === 0) {
    res.status(404).json({ error: 'Could not find any Netflix-titles to show' })
  } else {
    res.json(allTitles);
  }
})

//YEAR-ENDPOINT: get all titles from a specific year.
app.get('/netflix-titles/year/:year', async (req, res) => {
  const { year } = req.params
  const titlesByYear = await NetflixTitle.find({
    release_year: year
  })

  if (titlesByYear.length === 0) {
    res.status(404).json({ error: `Could not find any Netflix-title from year: ${year}` })
  } else {
    res.json(titlesByYear)
  }
})

// ID-ENDPOINT: to get one title by id (show_id)
app.get('/netflix-titles/id/:id', async (req, res) => {
  const { id } = req.params;
  const singleTitleById = await NetflixTitle.findOne({ show_id: id })

  if (singleTitleById) {
    res.json(singleTitleById)
  } else {
    res.status(404).json({ error: `Could not find any Netflix-title with id: ${id}` })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
