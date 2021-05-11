import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import designers from './data/designers.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Designer = mongoose.model('Designer', {
  name: String,
  surname: String,
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

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/designers', async (req, res) => {
  const designers = await Designer.find()
  res.json(designers)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
