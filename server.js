import express from "express"
import expressListEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"
import netflixData from "./data/netflix-titles.json"
import dotenv from "dotenv"

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

//Set Schema
const { Schema } = mongoose

const netflixSchema = new Schema({
  show_id: { type: Number, required: true },
  title: { type: String, required: true },
  director: String,
  cast: String,
  country: { type: String, required: true },
  date_added: Date,
  release_year: { type: Number, required: true },
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: { type: String, required: true },
})

const NetflixModel = mongoose.model("Netflix", netflixSchema)

//Set Seed
const resetAndSeedDatabase = async () => {
  try {
    await NetflixModel.deleteMany({})
    await NetflixModel.insertMany(netflixData)
    console.log("Database reset and seeded successfully")
  } catch (error) {
    console.error("Error resetting and seeding database:", error)
  }

  seedDatabase()
}

// Reset and seed database if RESET_DATABASE is set
if (process.env.RESET_DATABASE) {
  resetAndSeedDatabase()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app)
  res.json(endpoints)
})

// Endpoint to return all movies
app.get("/movies", async (req, res) => {
  try {
    const movies = await NetflixModel.find({ type: "Movie" })
    res.json(movies)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Endpoint to return data by country
app.get("/country", async (req, res) => {
  try {
    const mediaByCountry = await NetflixModel.aggregate([
      { $group: { _id: "$country", media: { $push: "$$ROOT" } } },
    ])
    const formattedData = mediaByCountry.reduce((acc, curr) => {
      acc[curr._id] = curr.media
      return acc
    }, {})
    res.json(formattedData)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Endpoint to return movie by ID
app.get("/movies/:id", async (req, res) => {
  const { show_id } = req.params
  try {
    const movie = await NetflixModel.findById(show_id)
    if (movie && movie.type === "Movie") {
      res.json(movie)
    } else {
      res.status(404).json({ message: "Movie not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
