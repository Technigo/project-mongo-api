import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

import data from './data/golden-globes.json'

dotenv.config()

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

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  response.send(listEndpoints(app))
})
app.get('/film', async(req, res) => {
  const { film } = req.query
try {
  if (film) {
  const goldenglobes = await GoldenGlobe.find({ 
    film: {
      $regex: new RegExp(film, "i") 
    }
  })
  res.json(goldenglobes)
} else {
  const goldenglobes = await GoldenGlobe.find()
  res.json(goldenglobes)
}
}
catch {
  res.status(400).json({error: 'An error occurred'})
}
})

app.get('/goldenglobes/:id', async (req, res) => {
  const { id } = req.params

  try {
  const singleFilm = await GoldenGlobe.findOne({ _id: id })
  res.json(singleFilm)
  } catch(error) {
    res.status(400).json({error: 'Id do not exist', details: error})
  }
})

app.get('/goldenglobes', async (req, res) => {
 try {
  const data = await GoldenGlobe.find()
 res.json(data)
} catch(error){
  res.status(400).json({error: 'Sorry, could not find the data'})
}
})
app.get('/goldenglobes/nominee/:nominee', async (req, res) => {
  const { nominee } = req.params

  const singleNominee = await GoldenGlobe.findOne({ nominee: nominee })
  res.json(singleNominee)
})
app.get('/mock', (req, res) => {
  response.send('')
})
// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
