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
  added: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
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

// Middlewares
app.use(cors())
app.use(bodyParser.json())
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailabale' })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Mongo-project: Guest list')
})

app.get('/guests', async (req, res) => {
  const guests = await Guest.find()
  const page = req.query.page
  const searchName = req.query.search
  const PER_PAGE = 10
  let guestList = guests

  if (searchName) {
    guestList = guestList.filter((item) => {
      const guestName = item.first_name.toLowerCase() || item.last_name.toLowerCase()
      return guestName.includes(searchName.toLowerCase())
    })
  }
  if (page) {
    const startIndex = PER_PAGE * page
    guestList = guestList.slice(startIndex, startIndex + PER_PAGE)
  }
  res.json({
    totalPages: Math.floor(guestList.length / PER_PAGE),
    guestList
  })
})

app.get('/guests/:id', async (req, res) => {
  const guest = await Guest.findById(req.param.id) // Id for specific guest
  if (guest) {
    res.json(guest)
  } else {
    res.status(404).json({ error: 'Guest not found' })
  }
})

// Preparing for nest step to use in form to add/update/delet guests
// app.post('/guests', (req, res) => {
//   return res.send('Received a POST HTTP method')
// })
// app.put('/guests/:id', (req, res) => {
//   return res.send(`PUT HTTP method on guest/${req.params.id} resource`)
// })
// app.delete('/guests/:id', (req, res) => {
//   return res.send(`DELETE HTTP method on guest/${req.params.id} resource`)
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
