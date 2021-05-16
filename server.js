import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import members from './data/technigo-members.json'
import roles from './data/technigo-roles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const memberSchema = new mongoose.Schema({
  name: String,
  surname: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  lettersInName: Number,
  isPapa: Boolean
})

const Member = mongoose.model('Member', memberSchema)

const rolesSchema = new mongoose.Schema({
  description: String
})

const Role = mongoose.model('Role', rolesSchema)

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Member.deleteMany()
    await Role.deleteMany()

    const rolesArray = []

    roles.forEach(async (item) => {
      const role = new Role(item)
      rolesArray.push(role)
      await role.save()
    })

    members.forEach(async (item) => {
      const newMember = new Member({
        ...item,
        role: rolesArray.find((singleRole) => singleRole.description === item.role)
      })
      await newMember.save()
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
  res.send('Welcome to my mongoDB API!')
})

app.get('/members', async (req, res) => {
  const { name } = req.query

  if (name) {
    try {
      const allMembers = await Member.find({ 
        name: {
          $regex: new RegExp(name, "i")
        } 
      })
      res.json(allMembers)
    } catch (error) {
      res.status(400).json({ error: 'Something went wrong', details: error })
    }
  } else {
    try {
      const allMembers = await Member.find()
      res.json(allMembers)
    } catch (error) {
      res.status(400).json({ error: 'Something went wrong', details: error })
    }
  }
})

app.get('/members/:id', async (req, res) => {
  const { id } = req.params

  try {
    const singleMember = await Member.findById(id)
    res.json(singleMember)
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong', details: error })
  }
})

app.get('/members/name/:memberName', async (req, res) => {
  const { memberName } = req.params

  try {
    const singleMember = await Member.findOne({ name: memberName })
    res.json(singleMember)
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong', details: error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
