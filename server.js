import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

import data from './data/golden-globes.json'

const mongoUrl = process.env.MONGO_URL || `mongodb+srv://${process.env.USER_ID}:${process.env.API_KEY}@cluster0.bvwog.mongodb.net/goldenGlobe?retryWrites=true&w=majority`
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const goldenGlobeSchema = new mongoose.Schema({
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
})

const GoldenGlobe = mongoose.model('GoldenGlobe', goldenGlobeSchema)

if(process.env.RESET_DB) {
  console.log('SEEDING')
  const seedDB = async () => {
    await GoldenGlobe.deleteMany()
    await data.forEach(item => {
      
      const newGoldenGlobe = new GoldenGlobe(item)
      newGoldenGlobe.save() 
    })
  }
  seedDB()
}
const newGoldenGlobe = new GoldenGlobe ({
  year_film: 2020,
  year_award: 2021,
  ceremony: 2021,
  category: "Best actresses",
  nominee: "Mary Jane",
  film: "Mary Jane",
  win: true
})

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})
app.get('/film', async(req, res) => {
  const film = await GoldenGlobe.find()
  res.json(film)
})
app.get('/goldenglobes/:film', async (req, res) => {
  const { film } = req.params

  const singleFilm = await GoldenGlobe.findOne({ _id: film })
  res.json(singleFilm)
})
// app.get('/goldenglobes', async (req, res) => {
//  const goldenglobes = await GoldenGlobe.find()
//  res.json(data)
// })
app.get('/goldenglobes/film/:nominee', async (req, res) => {
  const { nominee } = req.params

  const singleNominee = await GoldenGlobe.findOne({ nominee: nominee })
  res.json(singleNominee)
})
// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
