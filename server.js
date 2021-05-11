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

    await players.forEach(item => {
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
  const player = await Player.findById(req.params.id)
  if (player) {
    res.json(player)
  }
  // not working now
  // else {
  //   res.status(404).json({ error: 'Player not found' })
  // }
})

app.get('/countries/:country', async (req, res) => {
  const country = await Player.find({ country: req.params.country })
  if (country) {
    res.json(country)
  }
})



// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

// id: 609a438ce7f1994478171d73
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