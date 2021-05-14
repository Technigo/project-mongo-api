import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import dartPlayers from './data/dartPlayers.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const playerSchema = new mongoose.Schema({
  name: String,
  country: String,
  age: Number,
  dateOfBirth: String,
  nickname: String,
  ranking: Number,
  tourCard: String,
  careerEarnings: String
})

const Player = mongoose.model('Player', playerSchema)

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Player.deleteMany();

    await dartPlayers.forEach((item) => {
      const newPlayer = new Player(item);
      newPlayer.save();
    });
  }
  seedDatabase();
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

const checkParam = (array, param) => {
  for (const item of array) {
    const isIncluded = item.toLowerCase().includes(param.toLowerCase())
    if (isIncluded) {
      return true
    }
  }
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/players', async (req, res) => {
  try {
    const players = await Player.aggregate(
      [
        { $match: { ranking: { $lte: req.query.ranking ? +req.query.ranking : 200 } } },
        { $group: { _id: "$name", doc: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$doc" } },
        { $sort: { ranking: 1 } }
      ]
    )
    res.json(players)
  } catch {
    res.status(400).json({ error: 'Something went wrong' })
  }
})

app.get('/players/player/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
    if (player) {
      res.json(player)
    } else {
      res.status(404).json({ error: 'Player not found' })
    }
  } catch {
    res.status(400).json({ error: 'Invalid player id' })
  }
})

app.get('/countries', async (req, res) => {
  try {
    const countries = await Player.distinct('country')
    res.json(countries)
  } catch {
    res.status(400).json({ error: 'Something went wrong' })
  }
})

app.get('/countries/:country', async (req, res) => {
  try {
    const countries = await Player.distinct('country')

    if (checkParam(countries, req.params.country)) {
      const country = await Player.aggregate(
        [
          {
            $match:
            {
              $and: [
                { country: { $regex: new RegExp(req.params.country, "i") } },
                { ranking: { $lte: req.query.ranking ? +req.query.ranking : 200 } }
              ]
            }
          },
          { $group: { _id: "$name", doc: { $first: "$$ROOT" } } },
          { $replaceRoot: { newRoot: "$doc" } },
          { $sort: { ranking: 1 } }
        ]
      )
      if (country.length > 0) {
        res.json(country)
      } else {
        res.status(404).json({ error: 'Ranking not found' })
      }
    } else {
      res.status(404).json({ error: 'Country not found' })
    }
  } catch {
    res.status(400).json({ error: 'Something went wrong' })
  }
})

app.get('/nicknames', async (req, res) => {
  try {
    const nicknames = await Player.distinct('nickname')
    res.json(nicknames)
  } catch {
    res.status(400).json({ error: 'Something went wrong' })
  }
})

app.get('/nicknames/:nickname', async (req, res) => {
  try {
    const nicknames = await Player.distinct('nickname')

    if (checkParam(nicknames, req.params.nickname)) {
      const nickname = await Player.aggregate([
        { $match: { nickname: { $regex: new RegExp(req.params.nickname, "i") } } },
        { $group: { _id: "$name", doc: { $first: "$$ROOT" } } }
      ])
      res.json(nickname)
    } else {
      res.status(404).json({ error: 'Nickname not found' })
    }
  } catch {
    res.status(400).json({ error: 'Something went wrong' })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
