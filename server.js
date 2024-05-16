import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import expressListEndpoints from "express-list-endpoints"

//Import the data
import sneakerData from "./data/sneakers.json"
import Sneaker from "./models/Sneaker"

//.env
dotenv.config()

//Setting up the MongoDB connection using Mongoose,
//retrieves the MongoDB connection URL from the environment variables.
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-api"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

//Seed the database
if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Sneaker.deleteMany()

    sneakerData.forEach((sneaker) => {
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
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})

//Endpoint to fetch all sneakers
app.get("/sneakers", async (req, res) => {
  const allSneakers = await Sneaker.find()

  if (allSneakers.length > 0) {
    res.json(allSneakers)
  } else {
    res.status(404).send("No sneaker was found, please try again.")
  }
})

//Endpoint to fetch sneakers in-stock
app.get("/sneakers/in-stock", async (req, res) => {
  const sneakersInStock = await Sneaker.find({ inStock: true }).exec()

  if (sneakersInStock.length > 0) {
    res.json(sneakersInStock)
  } else {
    res.status(404).send("Sorry, no sneakers in stock right now!")
  }
})

//Endpoint to fetch sneaker by ID
app.get("/sneakers/:sneakerId", async (req, res) => {
  const { sneakerId } = req.params
  const sneaker = await Sneaker.findById(sneakerId).exec()

  if (sneaker) {
    res.json(sneaker)
  } else {
    res.status(404).send("No sneaker was found, please try again.")
  }
})

//Endpoint to fetch sneakers by brand
app.get("/sneakers/brand/:brand", async (req, res) => {
  const { brand } = req.params
  const sneakersByBrand = await Sneaker.find({
    brand: { $regex: new RegExp(brand, "i") },
  }).exec()

  if (sneakersByBrand.length > 0) {
    res.json(sneakersByBrand)
  } else {
    res
      .status(404)
      .send(
        `No sneakers with brand ${brand} was found, please try another brand.`
      )
  }
})

//Endpoint to fetch sneakers by name
app.get("/sneakers/name/:name", async (req, res) => {
  const { name } = req.params
  const sneakersByName = await Sneaker.find({
    name: { $regex: new RegExp(name, "i") },
  }).exec()

  if (sneakersByName.length > 0) {
    res.json(sneakersByName)
  } else {
    res
      .status(404)
      .send(
        `No sneakers with name ${name} was found, please try something else.`
      )
  }
})

//Endpoint to fetch sneakers by color
app.get("/sneakers/color/:color", async (req, res) => {
  const { color } = req.params
  const sneakersByColor = await Sneaker.find({
    color: { $regex: new RegExp(color, "i") },
  }).exec()

  if (sneakersByColor.length > 0) {
    res.json(sneakersByColor)
  } else {
    res
      .status(404)
      .send(
        `No sneakers whith color ${color} was found, please try another color.`
      )
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
