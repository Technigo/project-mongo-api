import express from "express"
import cors from "cors"
import mongoose from "mongoose"

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json"
import netflixShows from "./data/netflix-titles.json"
//import { all } from "express/lib/application"
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const Netflixshow = mongoose.model("Netflixshow", {
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
  type: String,
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Netflixshow.deleteMany()
    netflixShows.forEach((singleshow) => {
      const newShow = new Netflixshow(singleshow)
      newShow.save()
    })
  }
  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello! This is the API for week 18!")
})

app.get("/netflixshows/director/:director", async (req, res) => {
  const singleDirector = await Netflixshow.findOne({
    director: req.params.director,
  })
  res.send(singleDirector)
})

app.get("/netflixshows/title/:title", async (req, res) => {
  const netflixTitle = await Netflixshow.find({
    title: req.params.title,
  })
  res.send(netflixTitle)
})

app.get("/netflixshows/showsbytype/:type", async (req, res) => {
  const showtype = await Netflixshow.filter({
    type: req.params.type,
  })
  res.send(showtype)
})

app.get("/netflixshows", async (req, res) => {
  const { director, country } = req.query

  let allNetflixShows = netflixShows
  if (director && country) {
    allNetflixShows = await Netflixshow.find({
      director: director,
      country: country,
    })
    res.send(allNetflixShows)
  } else if (director && !country) {
    allNetflixShows = await Netflixshow.find({
      director: director,
    })
    res.send(allNetflixShows)
  } else if (!director && country) {
    allNetflixShows = await Netflixshow.find({
      country: country,
    })
  }
  res.send(allNetflixShows)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
