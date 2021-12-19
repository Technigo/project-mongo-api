import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import mongoose from 'mongoose'

import documentation from './data/documentation.json'
import data from './data/boardgames.json'
// https://www.kaggle.com/jvanelteren/boardgamegeek-reviews?select=2020-08-19.csv
// BoardGameGeek Reviews, dataset by Jesse van Elteren

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const BoardGame = mongoose.model('BoardGame', {
  index: Number,
  id: Number,
  name: String,
  year: Number,
  rank: Number,
  average: Number,
  bayesAverage: Number,
  usersRated: Number,
  url: String,
  thumbnail: String,
})

// getRandomInt function: to randomly skip() to a board game review
const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min)
}

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await BoardGame.deleteMany({})

    // instead of having the same keys as the JSON, I renamed it
    data.forEach((gameData) => {
      new BoardGame({
        index: gameData.Index,
        id: gameData['ID'],
        name: gameData.Name,
        year: gameData.Year,
        rank: gameData.Rank,
        average: gameData.Average,
        bayesAverage: gameData['Bayes average'],
        usersRated: gameData['Users rated'],
        url: gameData['URL'],
        thumbnail: gameData.Thumbnail,
      }).save()
    })
  }

  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// unreachable database -> status 503
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.json(documentation)
})

// list of endpoints
app.get('/endpoints', (req, res) => {
  res.send(listEndpoints(app))
})

// list all the board game reviews with pagination
app.get('/boardgames', async (req, res) => {
  try {
    // pagination: page = 0 and limit = 20, or we can change the value based on the query params
    const pagination = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 20,
    }

    const boardGames = await BoardGame.find()
      .skip(pagination.page * pagination.limit)
      .limit(pagination.limit)

    // count amount of reviews
    const totalBoardGames = await BoardGame.count()

    // if the array is not empty -> success: true
    // if the array is empty -> success: false
    if (boardGames.length > 0) {
      res.status(200).json({
        response: boardGames,
        // total pages: (amount of reviews / limit) and round up the result
        totalPages: Math.ceil(totalBoardGames / pagination.limit),
        success: true,
      })
    } else {
      res.status(404).json({
        error: 'No board game(s) found',
        success: false,
      })
    }
  } catch (err) {
    res.status(404).json({
      error: 'Page not found',
      success: false,
    })
  }
})

// list one board game review by id
app.get('/boardgames/:id', async (req, res) => {
  const { id } = req.params

  try {
    // randomly pick a board game review - '/boardgames/random'
    if (id === 'random') {
      const totalBoardGames = await BoardGame.count()

      // get a random integer between 0 and total amount of reviews by invoking getRandomInt().
      // use that random integer to skip and limit to one single review.
      const randomBoardGame = await BoardGame.find()
        .skip(getRandomInt(0, totalBoardGames))
        .limit(1)

      res.status(200).json({
        response: randomBoardGame,
        success: true,
      })
    } else {
      const boardGameById = await BoardGame.findById(id)

      if (boardGameById) {
        res.status(200).json({
          response: boardGameById,
          success: true,
        })
      } else {
        res.status(404).json({
          error: `Board game by id '${id}' not found`,
          success: false,
        })
      }
    }
  } catch (err) {
    res.status(404).json({
      error: `Invalid board game id '${id}'`,
      success: false,
    })
  }
})

// list the board game reviews by year
app.get('/boardgames/year/:year', async (req, res) => {
  try {
    const { year } = req.params

    const pagination = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 20,
    }

    const boardGamesByYear = await BoardGame.find({ year })
      .skip(pagination.page * pagination.limit)
      .limit(pagination.limit)

    const totalBoardGames = await BoardGame.count({ year })

    if (boardGamesByYear.length > 0) {
      res.status(200).json({
        response: boardGamesByYear,
        totalPages: Math.ceil(totalBoardGames / pagination.limit),
        success: true,
      })
    } else {
      res.status(404).json({
        error: `Board game(s) by year '${year}' not found`,
        success: false,
      })
    }
  } catch (err) {
    res.status(404).json({
      error: 'Page not found',
      success: false,
    })
  }
})

// sort the board game reviews by rank, from top to bottom
app.get('/ranked', async (req, res) => {
  try {
    const pagination = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 20,
    }

    const boardGamesRanked = await BoardGame.find()
      .sort({ rank: 1 })
      .skip(pagination.page * pagination.limit)
      .limit(pagination.limit)

    const totalBoardGames = await BoardGame.count()

    if (boardGamesRanked.length > 0) {
      res.status(200).json({
        response: boardGamesRanked,
        totalPages: Math.ceil(totalBoardGames / pagination.limit),
        success: true,
      })
    } else {
      res.status(404).json({
        error: 'Ranking not found',
        success: false,
      })
    }
  } catch (err) {
    res.status(404).json({
      error: 'Page not found',
      success: false,
    })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
