import express from 'express'
import cors from 'cors'
// mongoose framework for mongodb 
// express framework for node 
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

// setting app the database, where to find database
// if delployed process.env.MONGO_URL, otherwise localhost 
// project-mongo is the name of the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
// connectiong mangoose 
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

// CREATING MODEL HERE
// we need to create a model of our data, 
// this model is how the data should look like in the database
// specifing model, model() takes two arguments => modelname and an object 
const Show = mongoose.model("Show", {
  // the template how it should be stored, key=value, value is the datatype in this case
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  realese_year: String, 
  rating: String, 
  duration: String, 
  listed_in: String, 
  description: String, 
  type: String
})

if (process.env.RESET_DB) {
  // async awaut is just another method to do .then()
  const seedDatabase = async () => {
    // deleting all of the items in the database 
    await Show.deleteMany({})

    netflixData.forEach((showData) => {
      // forEach item in data array, we creating new show from the model
      // and save it with save() that exist in mongoose framework
      new Show(showData).save()
    })
  }
  // calling for function seedDatabase()
  seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world! Welcome my documentation!')
})

// path for all shows, both movies and tv shows 
app.get('/shows/', async (req, res) => {
  const shows = await Show.find()
  res.json(shows)
})

app.get('/shows/:id', (req, res) => {
  Show.findOne({ show_id: req.params.id }).then((show) => {
    if (show) {
      res.json(show)
    } else {
      res.status(404).json({ error: "Not Found" })
    }
  })
})

// movies path 
app.get('/movies', async (req, res) => {
  // finding all item with type Movie
  const findByType = await Show.find({ type: "Movie" })
  res.json(findByType)
})

// tv shows path 
app.get('/tvshows', async (req, res) => {
  // finding all items with type TV Show 
  const findByType = await Show.find({ type: "TV Show" })
  res.json(findByType)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

// FROM database mongodb compass
// id is generated automaticaly by mongoose and mongodb
// _id:61b762abb355c91b662c3f7c
// name:"Bob"
// age:36
// v is for version, not important 
// __v:0
