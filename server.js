import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
// import guests from './data/guests.json'
import users from './data/users.json'
import { Guest } from './models/guest'
import { User } from './models/user'

// MONGOOSE SETUP
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/guest-list'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// SEEDING FOR ADDING NEW DATA WHEN SETTING UP
if (process.env.RESET_DB) {
  console.log('Resetting database')
  const seedDatabase = async () => {
    await User.deleteMany({})

    users.forEach(({ name, email, password }) => {
      new User({ name, email, password: bcrypt.hashSync(password) }).save()
    })
  }
  seedDatabase()
}

// MIDDLEWARE TO CHECK ACCESSTOKEN FOR USERS (IF THE USER MATCH ANY ACCESSTOKEN IN DB)
const authenticateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ accessToken: req.header('Authorization') })
    if (user) {
      req.user = user;
      next()
    } else {
      res
        .status(401)
        .json({ loggedOut: true, message: 'Please try to log in again' })
    }
  } catch (err) {
    res
      .status(403)
      .json({ message: 'accesToken missing or wrong', errors: err.errors })
  }
};

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

// ROUTES
app.get('/', (req, res) => {
  res.send('Endpoints: GET/guests GET/guests/:id GET/guests?name= GET/guests?attending=true/false')
})

// ROUTE TO LOGIN USER
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(201).json({ name: user.name, userId: user._id, accessToken: user.accessToken })
    } else {
      res.json({ notFound: true })
    }
  } catch (err) {
    res.status(400).json({ message: 'Could not find user', errors: err.errors })
  }
})

// ------------------ GUEST LIST ROUTES ------------------------- //
// QUERYBUILDER TO HAVE MULTIPLE QUERIES IN GUESTS ROUTE
const queryBuilder = (req, res) => {
  const { name, attending } = req.query // Query params
  const nameRegex = new RegExp(name, 'i') // To be able to search in the whole string and not depending on upper/lowercase
  let query = {}
  // Query to search for first or last name
  if (name) {
    query = { $or: [{ 'first_name': nameRegex }, { 'last_name': nameRegex }] }
  }
  // Query to search for isAttending true or false
  if (attending) {
    query['isAttending'] = { $eq: attending } //Adds isAttending to query if name is also applied
  }
  return query
}

// GET ROUTE FOR GUESTS
app.get('/guests', async (req, res) => {
  // Gets the query from queryBuilder
  const query = queryBuilder(req, res)

  // If query is true: filter on that query, if false: return all guests
  const guests = query
    ? await Guest.find(query)
    : await Guest.find().sort('last_name').sort('first_name') // .sort({ 'added': -1 })

  // If there are any matching guests, return them. Else return error.
  if (guests) {
    res.json({
      guests: guests
    })
  } else {
    res.status(404).json({ error: 'No guests found' })
  }
})

// GET ROUTE FOR SPECIFIC ID
app.get('/guests/:id', async (req, res) => {
  const guest = await Guest.findById(req.params.id)
  if (guest) {
    res.json(guest)
  } else {
    res.status(404).json({ error: 'Guest not found' })
  }
})


// POST ROUTE
app.post('/guests', async (req, res) => {
  // Retrieve info sent by the client to our API endpoint
  const { first_name, last_name, email, phone, allergies, other, isAttending } = req.body
  // Use my mongoose model to create the database entry
  const guest = new Guest({ first_name, last_name, email, phone, allergies, other, isAttending })
  // Using try/catch instead of if/else
  try {
    //Sucess
    const savedGuest = await guest.save()
    res.status(201).json(savedGuest)
  } catch (err) {
    // Failed
    res.status(400).json({ message: 'Could not save guest', error: err.errors })
  }
})

// PUT ROUTE FOR SPECIFIC ID
app.put('/guests/:id', async (req, res) => {
  const { id } = req.params
  try {
    //Sucess
    await Guest.findOneAndUpdate({ '_id': id }, req.body, { new: true })
    res.status(201).json()
  } catch (err) {
    // Failed
    res.status(400).json({ message: 'Could not update guest', error: err.errors })
  }
})

// DELETE ROUTE FOR SPECIFIC ID
app.delete('/guests/:id', async (req, res) => {
  const { id } = req.params
  try {
    // Sucess to delete the guest
    await Guest.findOneAndDelete({ '_id': id })
    res.status(201).json()
  } catch (err) {
    // Failed
    res.status(404).json({ message: `Could not delete guest `, error: err.errors })
  }
})


// ------------------ TO DO ROUTES ------------------------- //

// GET

// POST

// PUT

// DELETE


// START THE SERVER
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
