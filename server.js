import express from "express"
import dotenv from 'dotenv'
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"

import sites from "./data/tech-sites.json"

dotenv.config()


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const siteSchema = new mongoose.Schema({
  siteId: Number,
  name: String,
  language: String,
  type: String,
  programming_language: String,
  topic: String,
  url: String,
  description: String,
  offer_training: Boolean,
  free_or_paid: String
})

const Site = mongoose.model('Site', siteSchema)

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Site.deleteMany()
    await sites.forEach(item => {
      const newSite = new Site(item)
      newSite.save();
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
app.get("/", (req, res) => {
  res.send(listEndpoints(app))
})

app.get("/techsites", async (req, res) => {
  const techsites = await Site.find()
  res.json(techsites)
})

app.get('/techsites/:id', async (req, res) => {
  const { id } = req.params

  try {
    const singleSite = await Site.findById(id)
    res.json(singleSite)
  } catch(error) {
    res.status(400).json({ error: 'Something went wrong', details: error })
  }
})

app.get('/techsites/name/:name', async (req, res) => {
  const { name } = req.params

  try {
    const singleSite = await Site.findOne({ name: name })
    res.json(singleSite)
  } catch(error) {
    res.status(400).json({ error: 'Something went wrong', details: error })
  }
})

app.get('/techsites/type/:type', async (req, res) => {
  const { type } = req.params

  try {
    const sitesOfType = await Site.find({ type: type })
    res.json(sitesOfType)
  } catch(error) {
    res.status(400).json({ error: 'Something went wrong', details: error })
  }
})


// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
