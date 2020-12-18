import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import regionList from './data/regions.json'
import caseTotals from './data/c19-sv.json'

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/covid19-sweden"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Define development port
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json parsing
app.use(cors())
app.use(bodyParser.json())
 
// Define data models
const Region = new mongoose.model('Region', {
  id: Number,
  region: String,
})

const Total = new mongoose.model('Total', {
  cases: Number,
  deaths: Number,
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region',
  }
})

// Listens for RESET_DB=true
if (process.env.RESET_DB) {
  console.log('Resetting DB!')

  // Clear the db
  const seed = async () => {
    await Region.deleteMany()
    await Total.deleteMany()

    // Create array for instance
    let instanceArray = []

    const eachRegion = regionList.map(item => item.region)
    const setRegion = new Set(eachRegion)
    
    setRegion.forEach(async item => {
      const newRegion = new Region(item)
      instanceArray.push(newRegion)
      await newRegion.save()
    })
    
    caseTotals.forEach(async caseItem => {
      const newTotal = new Total({
        ...caseItem,
        id: instanceArray.find(regionKey => regionKey.id === caseItem.id)
      })
      await newTotal.save()
    })
  }
  seed()
}

// route definitions
app.get('/', (req, res) => {
  res.send('This API is a coding project by Peggy @blipsandclicks made during Technigo bootcamp 2020 Fall session for educational purposes only. Please do not use this API, instead refer to the original data source Folkhälsomyndigheten. They provide interactive data visualisations and some raw data here: https://www.folkhalsomyndigheten.se/smittskydd-beredskap/utbrott/aktuella-utbrott/covid-19/statistik-och-analyser/bekraftade-fall-i-sverige/')
})

// route for regions and their IDs
app.get('/regions', async (req, res) => {
  const allRegions = await Region.find()
  res.json(allRegions)
})

// route of covid-19 data by region ID
// app.get('/totals', async (req,res) => {
//   const allTotals = await Total.find()
//   res.json(allTotals)
// })

// route of a single set of totals by region ID
// using findOne to return a single object
// app.get('/totals/:id', async (req,res) => {
//   const getTotals = await Total.findOne({ id })
//   res.json(getTotals)
// })

// start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})