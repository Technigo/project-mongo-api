import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

import avocadoSalesData from './data/avocado-sales.json'

dotenv.config()

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const AvocadoSale = mongoose.model('AvocadoSale', {
    date: String,
    averagePrice: Number,
    totalVolume: Number,
    totalBagsSold: Number,
    smallBagsSold: Number,
    largeBagsSold: Number,
    xLargeBagsSold: Number,
    region: String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await AvocadoSale.deleteMany()
    
    await avocadoSalesData.forEach(item => {
      const newAvocadoSale = new AvocadoSale({
        date: item.date,
        averagePrice: item.averagePrice,
        totalVolume: item.totalVolume,
        totalBagsSold: item.totalBagsSold,
        smallBagsSold: item.smallBagsSold,
        largeBagsSold: item.largeBagsSold,
        xLargeBagsSold: item.xLargeBagsSold,
        region: item.region
    })
      newAvocadoSale.save()
    })
  }
  seedDatabase()
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/sales', async (req, res) => {
  const avocadoSales = await AvocadoSale.find()
    res.json(avocadoSales)
})

//example sales/609e173829871328c9af6185
app.get('/sales/:saleId', async (req, res) => {
  const { saleId } = req.params
  const pointOfSale = await AvocadoSale.findById({ _id: saleId })
  res.json(pointOfSale)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
