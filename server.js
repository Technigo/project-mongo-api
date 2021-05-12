import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import players from './data/players.json'

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

    await players.forEach((item) => {
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

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/players', async (req, res) => {
  const players = await Player.find()
  res.json(players)
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
  const countries = await Player.distinct('country')
  res.json(countries)
})

app.get('/countries/:country', async (req, res) => {
  const countries = await Player.distinct('country')

  const countriesLowercase = []

  for (const country of countries) {
    countriesLowercase.push(country.toLowerCase())
  }

  if (countriesLowercase.includes(req.params.country.toLowerCase())) {
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
        { $group: { _id: "$_id", doc: { $first: "$$ROOT" } } },
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
})

app.get('/nicknames', async (req, res) => {
  const nicknames = await Player.distinct('nickname')
  res.json(nicknames)
})

app.get('/nicknames/:nickname', async (req, res) => {
  const nicknames = await Player.distinct('nickname')

  const nicknamesLowercase = []

  for (const nickname of nicknames) {
    nicknamesLowercase.push(nickname.toLowerCase())
  }

  if (nicknamesLowercase.includes(req.params.nickname.toLowerCase())) {
    const nickname = await Player.find({
      nickname: {
        $regex: new RegExp(req.params.nickname, "i")
      }
    })
    res.json(nickname)
  } else {
    res.status(404).json({ error: 'Nickname not found' })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

// id: 609a438ce7f1994478171d73

// 609a438ce7f1994478171d45
// {
//   "Name :": "Michael van Gerwen",
//   "Country :": "Netherlands",
//   "Age :": 32,
//   "Date Of Birth :": "4/25/1989",
//   "Nickname :": "Mighty Mike",
//   "PDC Ranking :": 1,
//   "Tour Card :": "Yes",
//   "careerEarnings": "£8,321,167"
// }