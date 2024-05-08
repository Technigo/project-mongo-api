import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import expressListEndpoints from "express-list-endpoints"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/restaurants"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const Restaurant = mongoose.model("Restaurant", {
  name: String,
  location: String,
  cuisine: String,
})

Restaurant.deleteMany().then(() => {
  new Restaurant({
    name: "Hej",
    location: "Stockholm",
    cuisine: "Sweden",
  }).save()
  new Restaurant({ name: "Ciao", location: "Milan", cuisine: "Italian" }).save()
  new Restaurant({
    name: "Bonjour",
    location: "Cannes",
    cuisine: "French",
  }).save()
})

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here

app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})
app.get("/restaurants", (req, res) => {
  Restaurant.find().then((restaurants) => {
    res.json(restaurants)
  })
})

app.get("/:name", (req, res) => {
  Restaurant.findOne({ name: req.params.name }).then((restaurant) => {
    if (restaurant) {
      res.json(restaurant)
    } else {
      res.status(404).json({ error: "Not found" })
    }
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
