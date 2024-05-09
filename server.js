import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import expressListEndpoints from "express-list-endpoints"
import Sneaker from "./models/Sneaker"

//Import the data
import sneakerData from "./data/sneakers.json"

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongo-api"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

//Seed the database
if (process.env.RESET_DATABASE) {

  const seedDatabase = async () => {
    await Sneaker.deleteMany()
  
    sneakerData.forEach(sneaker => {
      new Sneaker(sneaker).save()
    })
  }
  seedDatabase()
}

// Defines the port the app will run on.
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Route handler
//http://localhost:8080/
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app)

  const endpointsList = endpoints.map((endpoint) => {
    if (endpoint.path === "/sneakers") {
      endpoint.query = ["name", "brand", "color", "price"]
    } return endpoint
  })
  res.json(endpointsList)
})

//Get all sneakers
app.get("/sneakers", async (req, res) => {
  const allSneakers = await Sneaker.find()

  if (allSneakers.length > 0) {
    res.json(allSneakers)
  } else {
    res.status(404).send("No sneaker was found, please try again.")
  }
})

//Fetch all sneakers in-stock
app.get("/sneakers/in-stock", async (req, res) => {
  const sneakersInStock = await Sneaker.find({ inStock: true }).exec()

  if (sneakersInStock.length > 0) {
    res.json(sneakersInStock)
  } else {
    res.status(404).send("Sorry, no sneakers in stock right now!")
  }
})

//Get only one sneaker
app.get("/sneakers/:sneakerId", async (req, res) => {
  const { sneakerId } = req.params
  const sneaker = await Sneaker.findById(sneakerId).exec()

  if (sneaker) {
    res.json(sneaker)
  } else {
    res.status(404).send("No sneaker was found, please try again.")
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

