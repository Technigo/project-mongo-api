import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import netflixData from './data/netflix-titles.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Show = mongoose.model("Show", {
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
})

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await netflixData.forEach(item => {
      const newShow = new Show(item)
      newShow.save()
    })
  }
  seedDB()
}

// const newShow = new Show({
//   show_id: 81172543,
//   title: "Pirates of the Caribbean: The Curse of the Black Pearl",
//   director: "Gore Verbinski",
//   cast: "Johnny Depp, Geoffrey Rush, Orlando Bloom, Keira Knightley",
//   country: "United States",
//   date_added: "",
//   release_year: 2003,
//   rating: "PG-13",
//   duration: "143 min",
//   listed_in: "Action, Adventure, Fantasy",
//   description: "Blacksmith Will Turner teams up with eccentric pirate 'Captain' Jack Sparrow to save his love, the governor's daughter, from Jack's former pirate allies, who are now undead.",
//   type: "Movie"
// })
// newShow.save()

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
