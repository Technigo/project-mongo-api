import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import designers from './data/designers.json'

dotenv.config()

// Mongoose set up
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Mongoose schema to match the keys from the json 
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

//  Seeding the database from the json
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

// First page API page with possible endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})  

// Endpoint to get all the designers
// https://designers-api.herokuapp.com/designers
app.get('/designers', async (req, res) => {
  const designers = await Designer.find()
  res.json(designers)
})

// Endpoint to get designer by ID
// E.g https://designers-api.herokuapp.com/designers/609fa52d1dafed06ad8dda19
app.get('/designers/:designerId', async (req, res) => {
  const { designerId } = req.params
  const singleDesigner = await Designer.findById(designerId)
  res.json(singleDesigner)
})

// Endpoint to get designer by name
// E.g https://designers-api.herokuapp.com/designers/name/vivienne
app.get('/designers/name/:designerName', async (req, res) => {
  const { designerName } = req.params

  try {
    const singleDesigner = await Designer.findOne({ name: designerName })
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
