import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import regionData from './data/regions.json'
import covid19Data from './data/c19-sv.json'

// connect to MongoDB
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/c19"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// define data models
const RegionKey = mongoose.model('RegionKey', {
  regionId: Number,
  region: String
})

const Report = mongoose.model('Report', {
  cases: Number,
  deaths: Number,
  regionNum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RegionKey'
  }
})

// listens for RESET_DB=true
if (process.env.RESET_DB) {
  const seed = async () => {
    // clear db before repopulating
    await RegionKey.deleteMany()
    await Report.deleteMany()

    let instanceArray = []

    regionData.forEach(async item => {
    const newRegion = new RegionKey(item)
    instanceArray.push(newRegion)
    await newRegion.save()
    })

    covid19Data.forEach(async reportItem => {
      const newReport = new Report({
        ...reportItem,
        regionNum: instanceArray.find(key => key.regionId === reportItem.regionNum)
      })
      await newReport.save()
    })
  }
  seed()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

// middleware to detect if db is available and throws error to user if it is not.
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
   next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

const listEndpoints = require('express-list-endpoints')

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// get all regions and their objectIDs
app.get('/regions', async (req, res) => {
  const regionList = await RegionKey.find()
  res.json(regionList)
})

// get one region's report using that region's objectID
app.get('/reports/:id', async (req,res) => {
  try {
    const region = await RegionKey.findById(req.params.id)
    if (region) {
      const regionalReport = await Report.find({ regionNum: mongoose.Types.ObjectId(region.id) })
      res.json(regionalReport)
    } else {
      res.status(404).json({ error: 'Region not found' })
    } 
  } catch(err) {
      res.status(400).json({ error: 'Invalid region id'})
    }
})

// start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})