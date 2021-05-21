import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import netflixData from './data/netflix-titles.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const netflixDataSchema = new mongoose.Schema({
  title: String,
  releaseYear: Number,
  type: String,
  country: String,
  duration: String
})

const NetflixData = mongoose.model('NetflixData', netflixDataSchema)

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await NetflixData.deleteMany()

    await netflixData.forEach(item => {
      const newNetflixData = new NetflixData(item)
      newNetflixData.save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/netflixData', async (req, res) => {
  const netflixData = await NetflixData.find()
  res.json(netflixData)
})

app.get('/netflixData/:showId', async (req, res) => {
  const { showId } = req.params
  const singleShow = await NetflixData.findById(showId)
  res.json(singleShow)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
