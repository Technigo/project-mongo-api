import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"

import netflixData from "./data/netflix-titles.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const NetflixTitle = mongoose.model('NetflixTitle', {
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: String,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await NetflixTitle.deleteMany()
    netflixData.forEach((netflixData) => {
      const newNetflixTitle = new NetflixTitle(netflixData)
      newNetflixTitle.save()
    })
  }
  seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// Get all the Netflix movies and shows
app.get('/netflixtitles', async (req, res) => {
  const netflixTitles = await NetflixTitle.find()
  res.json(netflixTitles)
})

// Get one Netflix title based on id
app.get('/netflixtitles/id/:show_id', async (req, res) => {
  const netflixTitleById = await NetflixTitle.find({ show_id: req.params.show_id })
  res.send(netflixTitleById)
})

//   try {
//     const netflixTitleById = await NetflixTitle.findById(req.params.id)
//     if(!netflixTitleById) {
//       res.status(404).json({
//         response: 'Title not found',
//         success: false,
//       })
//     } else {
//       res.json({
//         response: netflixTitleById,
//         success: true,
//       })
//     }
//   } catch (err) {
//     res.status(400).json({
//       error: 'Id is invalid'
//     })
//   }
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})

