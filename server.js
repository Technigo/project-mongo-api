import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import allEndpoints from 'express-list-endpoints'

import players from "./data/football-players.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

const Player = mongoose.model('Player', {
  id: Number,
  name: String,
  position: String,
  club: String,
  games: Number,
  goals: Number,
})


if (process.env.RESET_DB) {
  console.log('Resetting database')
  const seedDatabase = async () => {
    await Player.deleteMany()
    players.forEach(player => {
      const newPlayer = new Player(player)
      newPlayer.save()
    })
  }
  seedDatabase()

}

app.get('/', (req, res) => {

  const documentation = {
    "About": "This is an open API about the Sweden women's national football team",
    "Routes": [
      {
        "/": "Documentation",
        "/endpoints": "All endpoints",
        "/players/all": "Get all players",
        "/players/club/${club}": "Get all the players in a specific club",
        "/players/name/${name}": "Get a specific player by name",
      }
    ]
  }

  res.send(documentation);
});

app.get('/players/all', (req, res) => {
  Player.find().then(players => {
    res.json(players)
  })
})

app.get('/players/club/:club', (req, res) => {
  Player.find({ club: req.params.club }).then(players => {
    if (players) {
      res.json(players)
    } else {
      res.status(404).json({ error: 'No players in that club was found' })
    }
  })
})

app.get('/players/name/:name', (req, res) => {
  Player.findOne({ name: req.params.name }).then(player => {
    if (player) {
      res.json(player)
    } else {
      res.status(404).json({ error: 'No player with that name was found' })
    }
  })
})

// List all endpoints
app.get('/endpoints', (req, res) => {
  res.send(allEndpoints(app))
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});
