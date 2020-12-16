import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
import goldenGlobesData from './data/golden-globes.json'
console.log(goldenGlobesData.length)
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const ERROR = { error: 'No results were found' }

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
app.use(bodyParser.json())


const Data = new mongoose.model('Data', {
    year_film: Number,
    year_award: Number,
    ceremony: Number,
    category: String,
    nominee: String,
    film: String,
    win: Boolean
})

//async await handles the asynchronous code (because we are using a database). By doing this we first clear the database 
// and it doesn't proceed with code on line 46 until the await on code 44 is finished. This is how we avoid adding the same data to the database all the time.
if (process.env.RESET_DATABASE) {
	const seedDatabase = async () => {
    await Data.deleteMany()

	goldenGlobesData.forEach((nominationData) => {
    const newData = new Data(nominationData)
      newData.save()
		})
  }
  seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Golden Globes nominations API in MongoDB')
})

//Shows all nominations. We can also query for information, for example to see all the movies that won we have to add to the URL: ?win=true. We can also add other things like for example the name of the film: ?win=true&film=Avatar
app.get('/nominations', async (req, res) => {
  const queryParameters = req.query
  const allNominations = await Data.find(req.query)
  res.json(allNominations)
})

//This will return one object with a specified actor, for example 'Sandra Bullock', if there is no such name it will return an error message. If we use Find instead of FindOne it will return all
// the objects with Sandra Bulllock as nominee.
app.get('/nominations/nominee/:nominee', async (req, res) => {
  const nominee = req.params.nominee
  const singleNominee = await Data.findOne({nominee: req.params.nominee})

  if (singleNominee.length === 0) {
    res.status(404).json(ERROR)
  } else {

  res.json(singleNominee)
  }
})

//Shows all nominations from a specified year
app.get('/nominations/year/:year', async (req, res) => {
  const year = req.params.year
  const nominationYear = await Data.find({ year_award: req.params.year});

  res.json(nominationYear)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
