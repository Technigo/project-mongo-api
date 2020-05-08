import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'

import { Food } from './data/food'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


if (process.env.RESET_DATABASE) {
  console.log('Resetting the database!')
  const seedDatabase = async () => {
    await Food.deleteMany()

    const buns = new Food({
      name: 'Cinnamon Buns',
      typeOf: 'The classic',
      ingredients: 10,
      time: 240,
    })
    await buns.save()

    const rhubarb = new Food({
      name: 'Rhubarb Pie',
      typeOf: 'Fresh and easy',
      ingredients: 6,
      time: 30,
    })
    await rhubarb.save()

    const mums = new Food({
      name: 'Love Mums',
      typeOf: 'Chocolate in pan',
      ingredients: 12,
      time: 30,
    })
    await mums.save()
  }
  seedDatabase()
}


// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world, next backend project!')
})

app.get('/dessert', async (req, res) => {
  const menu = await Food.find()
  res.json(menu)
})

app.get('/dessert/:id', async (req, res) => {
  const menuItem = await Food.findById(req.params.id)

  if (menuItem) {
    res.json(menuItem)
  } else {
    res.status(404).json({ error: 'Nope, nothing here!' })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
