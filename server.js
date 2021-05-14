import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import designers from './data/designers.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Designer = mongoose.model('Designer', {
  name: {
    type: String,
    lowercase: true
  },
  surname: {
    type: String,
    lowercase: true
  },
  wasBorn: Number,
  memberOfChambreSyndicaleDeLaHauteCouture: Boolean
})

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Designer.deleteMany()
    await designers.forEach(item => {
      new Designer(item).save()
    })
  }
  seedDB()
}

// Defining the port the app will run on
const port = process.env.PORT || 8080
const app = express()

// Middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Endpoint to get all the designers
app.get('/designers', async (req, res) => {
  const designers = await Designer.find()
  res.json(designers)
})

// Endpoint to get designer by ID
app.get('/designers/:designerId', async (req, res) => {
  const { designerId } = req.params
  const singleDesigner = await Designer.findById(designerId)
  res.json(singleDesigner)
})

// Endpoint to get designer by name
app.get('/designers/name/:designerName', async (req, res) => {
  const { designerName } = req.params

  try {
    const singleDesigner = await Designer.findOne({ name: designerName})
    res.json(singleDesigner)
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong', details: error })
  }
})

// Starting the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
