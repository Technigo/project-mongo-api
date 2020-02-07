import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import data from "./data/boardgames.json"
import descriptionData from "./data/gameDescriptions.json"

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
  //Queries
  const nameQuery = req.query.name
  const yearQuery = req.query.year
  const sort = req.query.sort
  let pageQuery = parseInt(req.query.page)

  //Regular expression to make it case insensitive
  const nameQueryRegex = new RegExp(nameQuery, "i")
  //Find everything in the db (no queries)
  let boardgames = await Boardgame.find()

  //Sort by name and year
  if (nameQuery && yearQuery) {
    boardgames = await Boardgame.find({ "name": nameQueryRegex, "year": yearQuery })
    //Name, year and average
    if (sort === "average") {
      boardgames = boardgames.sort((a, b) => -(parseFloat(a.average) - parseFloat(b.average)))
    }
    //Name, year and rank
    else if (sort === "rank") {
      boardgames = boardgames.sort((a, b) => (parseFloat(a.rank) - parseFloat(b.rank)))
    }
  }
  //Sort by name
  else if (nameQuery) {
    boardgames = await Boardgame.find({ "name": nameQueryRegex })
    //Name and average
    if (sort === "average") {
      boardgames = boardgames.sort((a, b) => -(parseFloat(a.average) - parseFloat(b.average)))
    }
    //Name and rank
    else if (sort === "rank") {
      boardgames = boardgames.sort((a, b) => (parseFloat(a.rank) - parseFloat(b.rank)))
    }
  }
  //Sort by year
  else if (yearQuery) {
    boardgames = await Boardgame.find({ "year": yearQuery })
    //Year and average
    if (sort === "average") {
      boardgames = boardgames.sort((a, b) => -(parseFloat(a.average) - parseFloat(b.average)))
    }
    //Year and rank
    else if (sort === "rank") {
      boardgames = boardgames.sort((a, b) => (parseFloat(a.rank) - parseFloat(b.rank)))
    }
  }
  //Sort only by average or rank
  else {
    if (sort === "average") {
      boardgames = boardgames.sort((a, b) => -(parseFloat(a.average) - parseFloat(b.average)))
    } else if (sort === "rank") {
      boardgames = boardgames.sort((a, b) => (parseFloat(a.rank) - parseFloat(b.rank)))
    }
  }

  const pageCount = Math.ceil(boardgames.length / 10)
  if (!pageQuery) {
    pageQuery = 1
  }
  else if (pageQuery > pageCount) {
    pageQuery = pageCount
  }

  res.json(boardgames.slice(pageQuery * 10 - 10, pageQuery * 10))

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
