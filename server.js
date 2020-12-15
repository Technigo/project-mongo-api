import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import avocadoSalesData from './data/avocado-sales.json'

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

const Avocado = new mongoose.model('Avocado', {
    id: Number,
    date: Date,
    averagePrice: Number,
    totalVolume: Number,
    totalBagsSold: Number,
    smallBagsSold: Number,
    largeBagsSold: Number,
    xLargeBagsSold: Number,
    region: String
})

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Avocado.deleteMany()
  
    avocadoSalesData.forEach(item => {
      const newAvocado = new Avocado(item);
      newAvocado.save()
    })
  }
  seedDatabase()
}

app.get('/avocados', async (req, res) => {
  const allAvocados = await Avocado.find()
  res.json(allAvocados)
})

app.get('/avocados/id/:id', async (req, res) => {
  const singleAvocado = await Avocado.findOne({ id: req.params.id })
  res.json(singleAvocado)

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
