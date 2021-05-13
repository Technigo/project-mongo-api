import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import trees from './data/trees.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/trees-of-umea"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const treeSchema = new mongoose.Schema({
  longitude: mongoose.Decimal128,
  latitude: mongoose.Decimal128,
  scientificName: String,
  treeType: String,
  streetOrPark: String
})

const Tree = mongoose.model('Tree', treeSchema)

if (process.env.RESET_DB) {
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Tree.deleteMany()

    trees.forEach((treeData) => {
      new Tree(treeData).save()
    })
  }
  seedDatabase()
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
  res.send(listEndpoints(app))
})

//ALL TREES WITH QUERY BY TREE NAME
app.get('/trees', async (req, res) => {
  const { name } = req.query

  if (name) {
    const trees = await Tree.find({ 
      scientificName: {
        $regex: new RegExp(name, "i")
      }
    })
    res.json(trees)
  } else {
    const trees = await Tree.find() 
    res.json(trees)
  }})

//TREE BY ID
app.get('/trees/id/:id', async (req, res) => {
  const { id } =req.params
  const treeById = await Tree.findById(id)
  res.json(treeById)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
