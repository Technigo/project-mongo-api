import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/movies"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//const Actor = mongoose.model('Actor', {
  //name: String
//})

const Movie = mongoose.model('Movie', {
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

//command: RESET_DATABASE=true npm run dev
if (process.env.RESET_DATABASE) {
  console.log('resetting database!')
  const populateDatabase = async () => {
    await Movie.deleteMany();
  
    netflixData.forEach(item => {
      const newMovie = new Movie(item);
      newMovie.save();
    })
  }
  populateDatabase();
}


//Command: RESET_DATABASE=true npm run dev 

//if (process.env.RESET_DATABASE) {
  //console.log('resetting database!')

  //const seedDatabase = async () => {
   //await Actor.deleteMany()
    //await Movie.deleteMany()
    
    //const pitt = new Actor({ name: 'Brad Pitt' })
    //await pitt.save()
  
    //const hopkins = new Actor({ name: 'Anthony Hopkins' })
    //await hopkins.save()

    //await new Movie({ title: 'The Silence of the Lambs', actor: hopkins }).save()
    //await new Movie({ title: 'Bobby', actor: hopkins }).save()
    //await new Movie({ title: 'Hannibal', actor: hopkins }).save()
    //await new Movie({ title: 'Troja', actor: pitt }).save()
    //await new Movie({ title: 'Mr. & Mrs. Smith ', actor: pitt }).save()
    //await new Movie({ title: 'Fight Club', actor: pitt }).save()
  //}
  //seedDatabase()
//}


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else { 
    res.status(503).json({ error: 'Service not available' })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  Actor.find().then(actors => {
    res.json(actors)
  })
})

app.get('/actors', async (req, res) => {
  const actors = await Actor.find()
  res.json(actors)
})

app.get('/actors/:id', async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
    if (actor) {
      res.json(actor)
    } else {
      res.status(404).json({ error: 'Actor not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid user id' })
  }
})

app.get('/actors/:id/movies', async (req, res) => {
  const actor = await Actor.findById(req.params.id) 
  if (actor) {
    const movies = await Movie.find({ actor: mongoose.Types.ObjectId(actor.id) })
    res.json(movies)
  } else {
    res.status(404).json({ error: 'Actor not found' })
  }
})

app.get('/movies', async (req, res) => {
  const movies = await Movie.find().populate('actor')
  res.json(movies)
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
