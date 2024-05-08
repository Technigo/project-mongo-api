import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import expressListEndpoints from "express-list-endpoints"
import { Restaurant } from "./models/Restaurant"
import michelinData from "./data/michelin-data.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/restaurants"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const seedDatabase = async () => {
  await Restaurant.deleteMany()
  await Restaurant.insertMany(michelinData)
}
seedDatabase()

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Endpoint listing
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})

// All restaurants
app.get("/restaurants", async (req, res) => {
  const allRestaurants = await Restaurant.find()

  if (allRestaurants.length > 0) {
    res.json(allRestaurants)
  } else {
    res.status(404).send("No restaurants with this criteria")
  }
})

// All unique cuisines
app.get("/cuisines", async (req, res) => {
  try {
    const uniqueCuisines = await Restaurant.distinct("cuisine")
    res.json(uniqueCuisines)
  } catch (error) {
    console.error("Error fetching unique cuisines", error)
    res.status(500).send("Internal Server Error")
  }
})

// Filter on cuisine
app.get("/cuisines/:cuisine", async (req, res) => {
  const { cuisine } = req.params

  try {
    //Find cuisines matching user input using mongoDB's regex operator to make the word in database case insensitive
    const restaurantsByCuisine = await Restaurant.find({
      cuisine: { $regex: new RegExp("^" + cuisine, "i") },
    })

    if (restaurantsByCuisine.length > 0) {
      res.json(restaurantsByCuisine)
    } else {
      res
        .status(404)
        .send(
          "No restaurants found within this cuisine, try searching for a cuisine found in the endpoint /cuisine. Add '%20' instead of spacing, for example 'African,%20Creative'"
        )
    }
  } catch (error) {
    console.error("Error fetching restaurants by cuisine", error)
    res.status(500).send("Internal Server Error")
  }
})

// Filter on name
// Filter on id
// Filter on location

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
