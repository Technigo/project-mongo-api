import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//Mongoose model 
const Show = mongoose.model("Show", {
  show_id: {
    type: Number
  },
  title: {
    type: String
  },
  director: {
    type: String
  },
  cast: {
    type: String
  },
  Country: {
    type: String
  },
  release_year: {
    type: Number
  },
  rating: {
    type: String
  },
  duration: {
    type: String
  },
  listed_in: {
    type: String
  },
  description: {
    type: String
  },
  type: {
    type: String
  }
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Show.deleteMany()

    netflixData.forEach((show) => {
      new Show(show).save()
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

// Home page
const listEndpoints = require('express-list-endpoints')
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//Route for all shows
app.get('/shows', async (req, res) => {
  const { title } = req.query;
  const queryRegex = new RegExp(title, 'i');
  const shows = await Show.find({ title: queryRegex })
  res.json(shows)
})

// Route for single show by id

app.get('/shows/:show_id', async (req, res) => {
  const { show_id } = req.params
  const showById = await Show.findOne({ show_id: show_id })

  if (showById) {
    res.json(showById)
  } else {
    res.status(404).json({ error: 'Show not found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
