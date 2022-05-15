import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from 'express-list-endpoints'

import printCollection from './data/print-collection.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/mongodb-prints"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// const Prints = mongoose.model("Prints", {
//   title: String,
//   price: Number,
//   media: String,
//   forSale: Boolean
// })


const Print = mongoose.model("Print", {
  id: Number,
  title: String,
  year: String,
  media: String,
  price: String,
  size: String,
  url: String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Print.deleteMany()
    printCollection.forEach( (singlePrint) => {
      const newPrint = new Print(singlePrint)
      newPrint.save()
    })
  }
  seedDatabase()
}

// const printOne = new Print({title: "Ocean View", price: 300, media: "Digital Photography", forSale: true})
// printOne.save()

// const printTwo = new Print({title: "Above", price: 400, media: "Digital Photography", forSale: true})
// printTwo.save()



// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app))
})

app.get("/prints", async (req,res) => {
  const allPrints = await Print.find(req.query)
  res.send(allPrints)
})

app.get("/prints/title/:title", async (req,res) => {
  // this will retrieve only one print
  const onePrint = await Print.findOne({title: req.params.title.toLowerCase()})
  res.send(onePrint)
})

app.get("/prints/year/:year", async (req,res) => {
  const byYear = await Print.find({year: req.params.year})
  res.send(byYear)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
