import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import guests from './data/guests.json'

// MONGOOSE SETUP
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/guest-list'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// MODEL FOR GUEST
const Guest = mongoose.model('Guest', {
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  phone: { type: Number },
  allergies: { type: String },
  other: { type: String },
  added: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  status_attending: { type: Boolean },
})

// RESET DATABASE ON START
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

// PORT & APP SETUP
const port = process.env.PORT || 8000 // Default 8000, can be overridden e.g PORT=5000 npm run dev
const app = express()

// MIDDLEWARES
app.use(cors())
app.use(bodyParser.json())
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailabale' })
  }
})

// ROUTES FOR GET
app.get('/', (req, res) => {
  res.send('Mongo-project: Guest list')
})

// All guests
app.get('/guests', async (req, res) => {
  const guests = await Guest.find()
  const statusAttending = req.query.attending
  const page = req.query.page
  const searchName = req.query.name
  const PER_PAGE = 5
  let guestList = guests

  // Attending true or false - Can I do this in a shorter way?
  if (statusAttending === 'true') {
    guestList = guestList.filter((item) => item.status_attending === true)
  }
  if (statusAttending === 'false') {
    guestList = guestList.filter((item) => item.status_attending === false)
  }

  // Searching on first name or last name
  if (searchName) {
    guestList = guestList.filter((item) => {
      const firstName = item.first_name.toLowerCase()
      const lastName = item.last_name.toLowerCase()
      return (firstName.includes(searchName.toLowerCase()) || lastName.includes(searchName.toLowerCase()))
    })
  }
  // Pagination
  if (page) {
    const startIndex = PER_PAGE * page
    guestList = guestList.slice(startIndex, startIndex + PER_PAGE)
  }
  res.json({
    totalGuests: guestList.length
    totalPages: Math.floor(guestList.length / PER_PAGE),
    guestList
  })
})

// Specific guest id
app.get('/guests/:id', async (req, res) => {
  const guest = await Guest.findById(req.param.id)
  if (guest) {
    res.json(guest)
  } else {
    res.status(404).json({ error: 'Guest not found' })
  }
})

// Preparing for next step to use in form to add/update/delete guests
// ROUTES FOR POST
// app.post('/guests', (req, res) => {
//   return res.send('Received a POST HTTP method')
// })
// ROUTES FOR PUT
// app.put('/guests/:id', (req, res) => {
//   return res.send(`PUT HTTP method on guest/${req.params.id} resource`)
// })
//ROUTES FOR DELETE
// app.delete('/guests/:id', (req, res) => {
//   return res.send(`DELETE HTTP method on guest/${req.params.id} resource`)
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
