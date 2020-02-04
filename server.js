/* eslint-disable no-undef */
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import athletesData from './data/athletes-data.json'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Athlete = mongoose.model('Athlete', {
  competitorid: String,
  competitorname: String,
  age: String,
  overallrank: String,
  affiliatename: String,
  countryoforiginname: String
})

const Box = mongoose.model('Box', {
  affiliateid: String,
  affiliatename: String,
  countryoforiginname: String,
  athlete: {
      //this object is relating to an object-ID from another model
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Athlete'
      }
})

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Athlete.deleteMany({})
    await Box.deleteMany({})

    athletesData.forEach((athleteData) => {
			new Athlete(athleteData).save()
			new Box(athleteData).save()
		})
  }

  seedDatabase()
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
})

app.get('/athletes', async (req, res) => {
  const athletes = await Athlete.find()
  console.log(athletes)
  res.json(athletes)
} )

app.get('/athletes/:id', (req, res) => {
  const showId = req.params.id 
    console.log(showId)
  const show = athletesData.filter(item => +item.competitorid === +showId)
    console.log("id path parameter")
  if (show) {
    res.json(show)
  } else {
    res.status(404).json({ error: 'Athlete not found' })
  }
})

app.get('/box', async (req, res) => {
  const box = await Box.find()
  console.log(box)
  res.json(box)
} )

// app.get('/athletes/:id/box', async (req, res) => {
//   const athlete = await Athlete.findById(req.params.id)
//   if (athlete) {
//     const box = await Box.find({ athlete: mongoose.Types.ObjectId(athlete.competitorid) })
//     res.json(box)
//   } else {
//     res.status(404).json({ error: 'Box not found' })
//   }
// })

// app.get('/athletes', (req, res) => {
//   // Query parameter
//   const searchString = req.query.search

//   let filteredAthletes = athletesData

//   // console.log(searchString)

//   if (searchString) {
//     // Filter once
//     // http://localhost:8080/athletes?search=Ulwahn
//     filteredAthletes = filteredAthletes.filter(item => {
//       const athleteName = item.competitorname.toString()
//       const athleteCountry = item.countryoforiginname.toString()
//       const athleteAffiliate = item.affiliatename.toString()
//       return athleteName.includes(searchString) ||
//         athleteCountry.includes(searchString) ||
//         athleteAffiliate.includes(searchString)
//     })
//   }
//   res.json(filteredAthletes)
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
