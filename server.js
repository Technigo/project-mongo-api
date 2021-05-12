import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import trees from './data/trees.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/trees-of-umea"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Tree = mongoose.model('Tree', {
  geoPoint: String,
  scientificName: String,
  treeType: String,
  streetOrPark: String
})

if (process.env.RESET_DB) {
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Tree.deleteMany({})

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
  res.send('Hello Bagheera')
})

app.get('/trees', async (req, res) => {
  const trees = await Tree.find()
  res.json(trees)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
