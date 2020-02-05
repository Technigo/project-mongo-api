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
  show_id: Number,
  title: String,
  // director: String,
  // cast: String,
  // country: String,
  // date_added: toString,
  // release_year: Number,
  // rating: String,
  // duration: toString,
  // listed_in: String,
  // description: String,
  // type: String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Show.deleteMany({})

    data.forEach((showData) => {
      new Show(showData).save()
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

//setup of GET route, client can fetch all the shows
app.get("/shows", async (req, res) => {
  const shows = await Show.find()
  res.json(shows)
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
