import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import regionData from './data/regions.json'
import covid19Data from './data/c19-sv.json'

// connect to MongoDB
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/c19se"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

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

app.get('/', (req, res) => {
  res.send('Hallå! This API is a coding project by Peggy @blipsandclicks made during Technigo bootcamp 2020 Fall session for educational purposes only. Please do not use this API, instead refer to the original data source Folkhälsomyndigheten. They provide interactive data visualisations and some raw data here: https://www.folkhalsomyndigheten.se/smittskydd-beredskap/utbrott/aktuella-utbrott/covid-19/statistik-och-analyser/bekraftade-fall-i-sverige/')
})

// get all regions and their objectIDs
app.get('/regions', async (req, res) => {
  const regionList = await RegionKey.find()
  res.json(regionList)
})

// get one region's report using that region's objectID
app.get('/reports/:id', async (req,res) => {
  const region = await RegionKey.findById(req.params.id)
  if (region) {
    const regionalReport = await Report.find({ regionNum: mongoose.Types.ObjectId(region.id) })
    res.json(regionalReport)
  } else {
    res.status(404).json({ error: 'Region not found' })
  }
})

// start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})