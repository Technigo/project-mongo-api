import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import goldenGlobesData from './data/golden-globes.json'
//console.log(goldenGlobesData)
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-anna"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Properties: key & value-pair. Constructor = new mongoose.model(). Function that
// takes two arguments: a string and an object. Calling a function with two arg.
// The object is called schema. Then we populate with instances of model with the
// properties of object.
const Nomination = new mongoose.model('Nomination', {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
});

// Start MongoDB: RESET_DB=true npm run dev
// To populate database: remove if-statement, push, put if-statement back, push again
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Nomination.deleteMany();
    goldenGlobesData.forEach(item => {
      const newNomination = new Nomination(item);
      newNomination.save();
    })
  }
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example: PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// express starts by using the middleware, check if database is connected. If ok,
// express goes on to first route. If not, it returns error 503

  app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable '})
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Endpoint returning all nominations 
app.get('/nominations', async (req, res) => {
  //const queryParameters = req.query;
  const allNominations = await Nomination.find(req.query);
  if (allNominations) {
    res.json(allNominations)
  } else {
    res.status(404).json({ error: 'Nominations not found' })
  }
})

// Endpoint returning all winners:
app.get('/nominations?win=true', async (req, res) => {
  const winners = await Nominee.find({ win: true });
  if (winners) {
    res.json(winners)
  } else {
    res.status(404).json({ error: 'Winners not found' })
  }
})

// Endpoint returning one winner of a category a defined year
app.get('/nominee/:year/:category/win=true', async (req, res) => {
  const { year, category } = req.params
  let filteredNominees = await Nominee.find(
    {
      year_award: year,
      category: category,
      win: true
    });
  if (filteredNominees) {
    res.json(filteredNominees)
  } else {
    res.status(404).json({ error: 'Winner not found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

