import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import netflixData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/netflix-catalogue'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service is currently unavailable.' })
  }
})

const Catalogue = mongoose.model('Catalogue', {
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String,
})

if (process.env.RESET_DB) {
  const netflixDb = async () => {
    await Catalogue.deleteMany({})
    netflixData.forEach((item) => {
      new Catalogue(item).save()
    })
  }
  netflixDb()
}

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/catalogue', async (req, res) => {
  console.log(req.query)
  // const { netflixTitle, netflixYear } = req.query
  let catalogueTitles = await Catalogue.find()
  // let catalogueTitles = netflixData

  // if (netflixTitle) {
  //   catalogueTitles = catalogueTitles.filter(
  //     (item) => item.title.toLowerCase().indexOf(netflixTitle.toLowerCase()) !== -1
  //   )
  // }

  // if (netflixYear) {
  //   catalogueTitles = catalogueTitles.filter(
  //     (item) => item.release_year === +netflixYear
  //   )
  // }

  res.json(catalogueTitles)
    
})

app.get('/catalogue/id/:netflixId', async (req, res) => {
  // const { netflixId } = req.params.show_id
  try {
    const titleById = await Catalogue.findById(req.params)
    // const titleById = await netflixData.find(
    //   (item) => item.show_id === +netflixId
    // )
  
    if (titleById) {
      res.status(200).json({
        response: titleById,
        success: true,
      })
    } else {
      res.status(404).json({
        response: 'No title by that ID was found.',
        success: false,
      })
    } 
  } catch (err) {
    res.status(400).json({ error: 'Invalid title ID' })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
