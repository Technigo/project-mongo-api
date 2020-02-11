import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import data from "./data/boardgames.json"

const Boardgame = mongoose.model("Boardgame", {
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

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/boardgames"
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

// Routes
app.get('/', (req, res) => {
  res.send('Welcome! Possible routes: /boardgames/ (with queries name, year, page and sort= rank, average, newest or oldest and /boardgames/:id.')
})

//All boardgames
app.get("/boardgames/", async (req, res) => {
  //Queries
  const { name, year, sort, page } = req.query

  //Regular expression to make it case insensitive
  const nameRegex = new RegExp(name, "i")

  //Puts name-query and year-query into an object
  const buildNameYearQuery = (name, year) => {
    let findNameYear = {}
    if (name) {
      findNameYear.name = name
    }
    if (year) {
      findNameYear.year = year
    }
    return findNameYear
  }

  //Checks the sortquery, and sorts according to increasing rank or decreasing average
  //Can also sort by year
  const buildSortQuery = (sort) => {
    if (sort === "rank") { return { rank: 1 } }
    else if (sort === "average") { return { average: -1 } }
    else if (sort === "newest") { return { year: -1 } }
    else if (sort === "oldest") { return { year: 1 } }
  }

  //Checks how many results should be skipped
  //e.g. if page = 1 it should skip none, if page it 2 it should skip 10
  //because the limit it set to 10
  const skipResults = (page) => {
    return ((page - 1) * 10)
  }

  //Find games based on name and year, sort on rank/average,
  //limit to 10 results per page, skip so that every page shows accurate results
  let boardgames = await Boardgame.find(buildNameYearQuery(nameRegex, year))
    .sort(buildSortQuery(sort))
    .limit(10)
    .skip(skipResults(page))
  //After all filters

  if (boardgames.length > 0) {
    res.json(boardgames)
  } else {
    res.status(404).json({ error: "Nothing found on those queries, try to search for something else" })
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
