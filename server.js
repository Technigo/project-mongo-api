import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import data from './data.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/netflix'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Show = mongoose.model('Show', {
  show_id: {
    type: Number
  },
  title: {
    type: String
  },
  release_Year: {
    type: String
  },
  duration: {
    type: String
  },
  description: {
    type: String
  },
  type: {
    type: String
  }
})

if (process.env.RESET_DATABASE) {
  console.log('Resetting DB')

  const seedDatabase = async () => {
    await Show.deleteMany()

    data.forEach((item) => {
      new Show(item).save()
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

const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// Get all shows
app.get('/shows', async (req, res) => {
  const { title, type } = req.query

  // Regex to make query case insensitive
  const regex = (query) => {
    return new RegExp(query, 'i')
  }

  // const shows = await Show.find()
  const showSearch = await Show.find({
    title: regex(title),
    type: regex(type)
  })

  if (showSearch) {
    res.json(showSearch)
  } else {
    res.status(404).json({ error: 'Show not found' })
  }

})

// Get show by ID
app.get('/shows/:id', async (req, res) => {
  const show = await Show.findById(req.params.id)

  if (show) {
    res.json(show)
  } else {
    res.status(404).json({ error: 'Show not found' })
  }
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
