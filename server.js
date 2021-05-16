import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"

import netflixData from "./data/netflix-titles.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Mongoose model. No showSchema because it's only going to be used here 
const Show = mongoose.model("Show", {
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
})

// Seed the data
if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Show.deleteMany()
    netflixData.forEach((item) => {
      const newShow = new Show(item)
      newShow.save()
    })
  }
  seedDB()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors, json body parsing and a error status if the database is down
app.use(cors())
app.use(express.json())
app.use((_, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})

// == Routes ==

// List all the endpoints
app.get("/", (_, res) => {
  res.send(listEndpoints(app))
})

// List all shows (all data)
app.get("/shows", async (_, res) => {
  // async/await version
  const shows = await Show.find()
  res.json(shows)
})

// Look for a specific show by using Mongo-ID 
app.get("/shows/:showId", async (req, res) => {
  try {
    const { showId } = req.params
    const singleShow = await Show.findById(showId)
    if (singleShow) {
      res.json(singleShow)
    } else {
      res.status(404).json({ error: "ID not found" })
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" })
  }
})

// Look for a specific show by using the title
app.get("/shows/title/:showTitle", async (req, res) => {
  const { showTitle } = req.params
  if (showTitle) {
    const titleForShow = await Show.findOne({ 
      title: {
        // Regex to ignore if the letters are capitalized or not in the param 
        $regex: showTitle, $options: "i" 
      }
    })
    res.json(titleForShow)
  } else {
    const titleForShow = await Show.findOne()
    res.json(titleForShow)
  } 
})

// == Start the server ==
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
