import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import potterData from './data/potterData.json'

//The name of the database - mongodb://localhost/mongo-project-potter
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/mongo-project-potter"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


//POTTER CHARACTER MODEL
const Character = mongoose.model('Character', {
  id: Number,
  name: String,
  gender: String,
  job: String,
  house: String,
  wand: String,
  patronus: String,
  species: String,
  blood_status: String,
  hair_colour: String,
  eye_colour: String,
  loyalty: String,
  skills: String,
  birth: String,
  death: String
})

//Wrap the seed in an enviorment variable to prevent it from re-run everytime we start the server. RESET_DB=true npm run dev
if (process.env.RESET_DB) {
  console.log('Resetting database!!')
  const seedDatabase = async () => {
    await Character.deleteMany()

    potterData.forEach((character) => {
      new Character(character).save()
    })
  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//   PORT=9000 npm start
const port = process.env.PORT || 9090
const app = express()

// MIDDLEWARES
app.use(cors())
app.use(bodyParser.json())
//A function that recives a request, the response and the argument "next". 
//It will execute before the routes below, if it's not evoked next() it will block the code coming next. The conenction.readyState checks that the connection is good.
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// GET ROUTES
app.get('/', (req, res) => {
  res.send('Mongo-project: Harry Potter characters')
})

//GET ALL CHARACTERS
app.get('/characters', async (req, res) => {
  const characters = await Character.find()
  res.json(characters)
})

//GET SPECIFIC CHARACTER http://localhost:9090/characters/2
app.get("/characters/:id", async (req, res) => {
  const id = req.params.id
  const character = await Character.findOne({ "id": id })
  if (character) {
    res.json(character)
  } else {
    res.status(404).json({ error: "Character not found" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
