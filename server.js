import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import places from "./data/dream-places.json"

const mongoUrl = process.env.MONGO_URL
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Location = mongoose.model("Location", {
  name: String,
  keywords: String,
  coherence: Number,
  mainSourceA: String,
  mainSourceB: String,
  status: String,
  governor: String,
  population: Number,
  size: String
})

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Location.deleteMany()

    await places.forEach(place => {
      const newLocation = new Location(place)
      newLocation.save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send("hello there")
})

app.get('/locations', async (req, res) => {
  const { status } = req.query
  
  if (status) {
    const locations = await Location.find({
      status: {
        $regex: new RegExp(status, "i")
      }
    })
    res.json(locations)
  } else {
    const locations = await Location.find()
    res.json(locations)
  }
})

app.get('/locations/:locationId', async (req, res) => {
  const { locationId } = req.params
  try {
    const singleLocation = await Location.findOne({ _id: locationId })
    res.json(singleLocation)
  } catch(error) {
    res.status(400).json({ error: "something went wrong :(", details: error })
  }
})

app.get('/locations/name/:locationName', async (req, res) => {
  const { locationName } = req.params
  console.log(locationName)
  const singleLocation = await Location.findOne({ name: locationName })
  console.log(singleLocation)
  res.json(singleLocation)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
