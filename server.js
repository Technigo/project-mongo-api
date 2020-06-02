import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/movies"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


//mongoose models
const Actor = mongoose.model('Actor', {
  name: String
});
const Movie = mongoose.model('Movie', {
  title: String,
  year: Number,
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor'
  }
});

//seed database with content 
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Actor.deleteMany()
    await Movie.deleteMany()

    const winslet = new Actor({ name: 'Kate Winslet' })
    await winslet.save()

    const dicaprio = new Actor({ name: 'Leonardo Di Caprio ' })
    await dicaprio.save()

    const depp = new Actor({ name: 'Johnny Depp' })
    await depp.save()

    await new Movie({ title: 'The Mountain Between Us', year: 2017, actor: winslet }).save()
    await new Movie({ title: 'The Dressmaker', year: 2015, actor: winslet }).save()
    await new Movie({ title: 'Public Enemies', year: 2009, actor: depp }).save()
    await new Movie({title:'Black Mass', year: 2015, actor: depp}).save()
    await new Movie({title:'Shutter Island', year: 2010, actor: dicaprio}).save()
    await new Movie({title:'Once Upon a Time In Hollywood', year: 2019, actor: dicaprio}).save()
  }
  seedDatabase()
};

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())
//if database is not connecting
//app.use((req, res, next) => {
 // if (mongoose.connection.readyState === 1) {
  //  next()
  //} else {
 //   res.status(503).json({ error: 'Service unavalable' })
 // }
//});

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
});

//get all info from the Actor model
app.get('/actors', async (req, res) => {
  try {
    const actor = await Actor.find()
      if (actor) {
        res.json(actor)
      } else {
        res.status(404).json ({ error: 'Could not find actors' })
      }
  } catch(err) {
    res.status(400).json ({ error: 'Invalid request' })
  }
});
//get actor by id
app.get('/actors/:id', async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
      if (actor) {
        res.json(actor)
      } else {
        res.status(404).json ({ error: 'Id not found' })
      }
  } catch(err) {
    res.status(400).json ({ error: 'Invalid request' })
  }
});

//get all movies from one actor
app.get('/actors/:id/movies', async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
    const movies = await Movie.find({ actor: mongoose.Types.ObjectId(actor.id)})
      if(movies) {
        res.json(movies)
      } else {
        res.status(404).json ({ error: 'Could not find movies' })
      }
  } catch(err) {
    res.status(400).json ({ error: 'Invalid request' })
  }
});

//get movies with connection to actor
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find().populate('actor')
      if (movies) {
        res.json(movies)
      } else {
        res.status(404).json ({ error: 'Could not find information' })
      }
  } catch(err) {
    res.status(400).json ({ error: 'Invalid request' })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});
