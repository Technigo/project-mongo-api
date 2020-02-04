import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import guests from './data/guests.json'

// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'

// Boiler plate for setting up mongoose
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


// Model for guest
const Guest = mongoose.model('Guest', {
  first_name: String,
  last_name: String,
  email: String,
  phone: Number,
  allergies: String,
  other: String,
  date_added: Date,
  date_updated: Date,
  status_attending: Boolean,
})

if (process.env.RESET_DB) {
  console.log('Resetting database')
  const seedDatabase = async () => {
    await Guest.deleteMany({})

    guests.forEach((guestData) => {
      new Guest(guestData).save()
    })
  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8000, but can be 
// overridden when starting the server. For example: PORT=9000 npm start
const port = process.env.PORT || 8000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Mongo-project: Guest list')
})

app.get('/guests', async (req, res) => {
  const guests = await Guest.find()
  res.json(guests)
})

app.get('/guests/:id', async (req, res) => {
  const guest = await Guest.findById(req.param.id) // Id for specific guest
  if (guest) {
    res.json(guest)
  } else {
    res.status(404).json({ error: 'Guest not found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
