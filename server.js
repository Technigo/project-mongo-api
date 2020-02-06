import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import data from './data/netflix-titles.json'



//setup connection to mongodb
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/shows"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


//to prevent reloading seeddatabase when server starts, we can wrap it in an environment variable//

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
  }
})

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

//setup of GET route, client can fetch all the movies
app.get("/shows/movies", async (req, res) => {
  Show.find({ 'type': /Movie/i })
    .then((results) => {
      // Succesfull
      console.log('Found : ' + results)
      res.json(results)
    }).catch((err) => {
      // Error - Failure
      // console.log('Error ' + err)
      res.json({ message: 'Cannot find the movie', err: err })
    })
})



//Regular expression => display all the shows which are included "Comedies" word, and the 'i' = uppercase/lowercase
app.get("/shows", async (req, res) => {
  Show.find({ 'listed_in': /Comedies/i })
    .then((results) => {
      // Succesfull
      console.log('Found : ' + results)
      res.json(results)
    }).catch((err) => {
      // Error - Failure
      // console.log('Error ' + err)
      res.json({ message: 'Cannot find this show', err: err })
    })
})

//query-params to be able to search shows title
app.get("/shows/:title", async (req, res) => {
  const title = req.query.title
  //use string variable to regex javascript//
  const queryRegex = new RegExp(title, 'i')
  Show.find({ 'title': queryRegex })
    .then((results) => {
      // Succesfull
      console.log('Found : ' + results)
      res.json(results)
    }).catch((err) => {
      // Error - Failure
      // console.log('Error ' + err)
      res.json({ message: 'Cannot find this show', err: err })
    })
})






// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
