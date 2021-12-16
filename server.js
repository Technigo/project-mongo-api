import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import mongoose from 'mongoose'

import data from './data/boardgames.json'
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

// https://www.kaggle.com/jvanelteren/boardgamegeek-reviews?select=2020-08-19.csv
// BoardGameGeek Reviews, dataset by Jesse van Elteren

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const BoardGame = mongoose.model('BoardGame', {
  // Properties defined here match the keys from the people.json file
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

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await BoardGame.deleteMany({})

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
//
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
  res.send('Hello world')
})

// list of endpoints
app.get('/endpoints', (req, res) => {
  res.send(listEndpoints(app))
})

// list all the board games with query params
app.get('/boardgames', async (req, res) => {
  // with query
  // console.log(req.query)
  // https://boardgames-katie.herokuapp.com/boardgames?year=2010
  try {
    // pagination - page = 0 and limit = 20 or we can change the value based on the query params
    const pagination = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 20,
    }

    let boardGames = await BoardGame.find(req.query)
      .skip(pagination.page * pagination.limit)
      .limit(pagination.limit)

    // console.log(boardGames.length)

    // http://localhost:8080/boardgames?index=90
    // if the array is not empty -> success
    // if the array is empty -> success false
    if (boardGames.length > 0) {
      res.status(200).json({
        response: boardGames,
        success: true,
      })
    } else {
      res.status(404).json({
        error: 'No board game(s) found', // response:
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

// list one board game by id
app.get('/boardgames/:id', async (req, res) => {
  const { id } = req.params
  try {
    console.log('id: ', id)
    console.log('data type id: ', typeof id)
    // const boardGameById = await BoardGame.findById(id)

    // randomize a board game
    if (id === 'random') {
      const totalBoardGames = await BoardGame.count()
      console.log(totalBoardGames) // 18801 (actual count is 19329)
      const randomBoardGame = await BoardGame.find({
        index: parseInt(Math.random() * (totalBoardGames - 0) + 0, 10),
      })

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
          error: `Board game by id '${id}' not found`, // response:
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

// randomize a board game
// app.get('/boardgames/random', async (req, res) => {
//   const totalBoardGames = await BoardGame.find()
//   console.log(totalBoardGames.length) // 18801
//   const randomBoardGame = await BoardGame.find({
//     index: parseInt(Math.random() * (totalBoardGames.length - 1 - 0) + 0, 10),
//   })

//   res.json(randomBoardGame)
// })

// list the board games by year
app.get('/boardgames/year/:year', async (req, res) => {
  try {
    const { year } = req.params
    const boardGameByYear = await BoardGame.find({ year })
    // console.log(boardGameByYear.length)
    if (boardGameByYear.length > 0) {
      res.status(200).json({
        response: boardGameByYear,
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

// sort the board games by rank, from top to bottom
// http://localhost:8080/ranks
// http://localhost:8080/ranks?page=1
// http://localhost:8080/ranks?page=0&limit=5
app.get('/ranks', async (req, res) => {
  try {
    // pagination - page = 0 and limit = 20 or we can change the value based on the query params
    const pagination = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 20,
    }

    const boardGameRanks = await BoardGame.find()
      .sort({ rank: 1 })
      .skip(pagination.page * pagination.limit)
      .limit(pagination.limit)

    console.log(boardGameRanks.length)

    if (boardGameRanks.length > 0) {
      res.status(200).json({
        response: boardGameRanks,
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

// use query for sorting instead? /boardgames?order=

// list top 20 ranked board games (according to Bayesian average)
app.get('/top_20', async (req, res) => {
  try {
    const boardGameTop20 = await BoardGame.find().sort({ rank: 1 }).limit(20)
    if (boardGameTop20.length > 0) {
      res.status(200).json({
        response: boardGameTop20,
        success: true,
      })
    } else {
      res.status(404).json({
        error: 'Top 20 board games not found',
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

// list top 20 most rated board games by users
app.get('/top_20_rated', async (req, res) => {
  try {
    const boardGameTopRated = await BoardGame.find()
      .sort({ usersRated: -1 })
      .limit(20)

    if (boardGameTopRated.length > 0) {
      res.status(200).json({
        response: boardGameTopRated,
        success: true,
      })
    } else {
      res.status(404).json({
        error: 'Top 20 most rated board games by users not found',
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

// sort the board games alphabetically, from characters (# * .) -> number (0-9) -> letters (a-z, other)
app.get('/alphabet', async (req, res) => {
  try {
    const boardGameAlphabet = await BoardGame.find(req.query).sort({ name: 1 })

    if (boardGameAlphabet.length > 0) {
      res.status(202).json({
        response: boardGameAlphabet,
        success: true,
      })
    } else {
      res.status(404).json({
        response: 'List of board games (alphabetically) not found',
        success: false,
      })
    }
    res.json(boardGameAlphabet)
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
