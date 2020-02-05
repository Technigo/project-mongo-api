import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import data from "./data/boardgames_small.json"

const Boardgame = mongoose.model("Boardgame", {
  // ?
  // Properties defined here match the keys from the people.json file
  id: Number,
  name: String,
  year: Number,
  rank: Number,
  average: Number,
  bayes_average: Number,
  users_rated: Number,
  url: String,
  thumbnail: String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Boardgame.deleteMany({})

    data.forEach((boardgameData) => {
      new Boardgame(boardgameData).save()
    })
  }
  seedDatabase()
}

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 9090
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

//Database not connected
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

//All boardgames
app.get("/boardgames/", async (req, res) => {
  //query for name
  const nameQuery = req.query.name
  const yearQuery = req.query.year
  const sortOnRank = req.query.rank
  const sortOnAverage = req.query.average

  const nameQueryRegex = new RegExp(nameQuery, "i")
  const boardgames = await Boardgame.find() //Find everything in the db

  //regex - /harry/ matches harry potter
  ///harry/i will make it case insensitive


  if (nameQuery && yearQuery) {
    const boardgamesByNameAndYear = await Boardgame.find({ "name": nameQueryRegex, "year": yearQuery })
    res.json(boardgamesByNameAndYear)
  } else if (nameQuery) {
    const boardgamesByName = await Boardgame.find({ "name": nameQueryRegex })
    res.json(boardgamesByName)
  } else if (yearQuery) {
    const boardgamesByYear = await Boardgame.find({ "year": yearQuery })
    res.json(boardgamesByYear)
  } else {
    res.json(boardgames)
  }
})

//Single boardgame
app.get("/boardgames/:id", async (req, res) => {
  const id = req.params.id
  const boardgame = await Boardgame.findOne({ "id": id })
  if (boardgame) {
    res.json(boardgame)
  } else {
    res.status(404).json({ error: "Boardgame not found" })
  }
})

// app.get("/boardgames/:id", async (req, res) => {
//   const boardgame = await Boardgame.findById(req.params.id)
//   if (boardgame) {
//     res.json(boardgame)
//   } else {
//     res.status(404).json({ error: "Boardgame not found" })
//   }
// })


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
