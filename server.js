import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import expressListEndpoints from "express-list-endpoints"
import { Restaurant } from "./models/Restaurant"
import michelinData from "./data/michelin-data.json"

//Set up MongoURL and localhost
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/restaurants"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Restaurant.deleteMany()
    //insert each document in the array into the collection
    await Restaurant.insertMany(michelinData)
  }
  seedDatabase()
}

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
  //Parse query parameters for pagination
  const page = parseInt(req.query.page) || 1 //Defaults to page 1 if invalid
  const limit = 100 //Display 100 restaurants per page
  const skip = (page - 1) * limit //Calc the number of restos to skip for current page

  try {
    const allRestaurants = await Restaurant.find().skip(skip).limit(limit)

    if (allRestaurants.length > 0) {
      res.json(allRestaurants)
    } else {
      res.status(404).send("No restaurants with this criteria")
    }
  } catch (error) {
    console.error("Error fetching restaurants", error)
    res.status(500).send("Internal Server Error")
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

// Filter on location

// Filter on name

// Filter on id

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
