import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import data from './data/netflix-titles.json'



//setup connection to mongodb
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/shows"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


//setup of shows title
const Show = mongoose.model('Show', {
  // Properties defined here match the keys from the netflix-title.json file
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
  country: {
    type: String
  },
  date_added: {
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
  },
})


//to prevent reloading seeddatabase when server starts, we can wrap it in an environment variable//
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Show.deleteMany({})

    data.forEach((show) => {
      new Show(show).save()
    })
  }

  seedDatabase()
}


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


// Regular expression => display all the shows which are included "Comedies" word, and the 'i' = uppercase/lowercase
// http://localhost:8080/shows?year=2018&title=people&listed_in=international
app.get("/shows", async (req, res) => {
  let queryObj = {}
  
  let startIndex, perPage
  if (req.query.perPage) {
    perPage = +req.query.perPage
  }
  if (req.query.page && req.query.perPage) {
    startIndex = perPage * (+req.query.page - 1)
  }
  if (req.query.listed_in) { queryObj['listed_in'] = new RegExp(req.query.listed_in, 'i') }
  if (req.query.year) { queryObj['release_year'] = req.query.year }
  if (req.query.title) { queryObj['title'] = new RegExp(req.query.title, 'i') }

  Show.find(queryObj).sort('title')
    .then((results) => {
      let resultsObj = {
        "total_shows": results.length
      }
      // Successful
      if (req.query.page && req.query.perPage) {
        resultsObj.shows = results.slice(startIndex, startIndex + perPage)
        res.json(resultsObj)
      } else {

        resultsObj.shows = results
        res.json(resultsObj)
      }

    }).catch((err) => {
      //Error - Failure
      res.json({ message: 'Cannot find this show', err: err })
    })
})


// path-params to be able to find a specefic show //
// http://localhost:8080/shows/id/81082007/
app.get("/shows/id/:id", async (req, res) => {
  const id = req.params.id
  Show.findOne({ 'show_id': id })
    .then((result) => {
      // Succesfull//
      res.json(result)
    }).catch((err) => {
      // Error - Failure//
      res.json({ message: 'Cannot find this show', err: err })
    })
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
