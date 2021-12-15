import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import avocadoSales from './data/avocado-sales.json'


// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-avocado-sales"
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
app.use(express.json()) 

// Set up a mongoose model
const Sale = mongoose.model('Sale', {
  id: Number,
  date: String,
  averagePrice: Number,
  totalVolume: Number,
  totalBagsSold: Number,
  smallBagsSold: Number,
  largeBagsSold: Number,
  xLargeBagsSold: Number,
  region: String
})

// Seed the database with the data for the avocado sales
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Sale.deleteMany({})

    avocadoSales.forEach(item => {
      const newSale = new Sale(item)
      newSale.save()
    })
  }

  seedDatabase()
}

// This is our first endpoint
app.get('/', (req, res) => {
  res.send('Hello from us!')
})

// Get all the sales
// Filter based on queries to get the sales for a specific region, date etc
app.get('/sales', async (req, res) => {
  const sales = await Sale.find(req.query)
  if (sales.length > 0) {
  res.json(sales)
  }
  else {
    res.status(404).json({ error: 'Sorry, cannot be found' })
  }
})

// Get one sale based on id
app.get('/sales/id/:id', async (req, res) => {
  try {
    const saleById = await Sale.findById(req.params.id)
    if (saleById) {
      res.json(saleById)
    } else {
      res.status(404).json({ error: 'Sale not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Id is invalid' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} YAY YAY`)
})