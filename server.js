import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import guests from './data/guests.json'
import { Guest } from './models/guest'

// MONGOOSE SETUP
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/guest-list'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// SEEDING FOR ADDING NEW DATA
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

  let guestList = guests

  // Attending true or false - Can I do this in a shorter way?
  const statusAttending = req.query.attending
  if (statusAttending === 'true') {
    guestList = guestList.filter((item) => item.status_attending === true)
  }
  if (statusAttending === 'false') {
    guestList = guestList.filter((item) => item.status_attending === false)
  }

  // Searching on first name or last name - how to do this the mongoose way?
  const searchName = req.query.name
  if (searchName) {
    guestList = guestList.filter((item) => {
      const firstName = item.first_name.toLowerCase()
      const lastName = item.last_name.toLowerCase()
      return (firstName.includes(searchName.toLowerCase()) || lastName.includes(searchName.toLowerCase()))
    })
  }

  // Pagination - how to do this the mongoose way?
  const page = req.query.page
  const PER_PAGE = 10
  if (page) {
    const startIndex = PER_PAGE * page
    guestList = guestList.slice(startIndex, startIndex + PER_PAGE)
  }
  res.json({
    totalPages: Math.floor(guests.length / PER_PAGE),
    guestList
  })
})

// Specific guest id
app.get('/guests/:id', async (req, res) => {
  const guest = await Guest.findById(req.params.id)
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
