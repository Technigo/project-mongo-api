import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"

// import books from "./data/books.json"
import netflixData from "./data/netflix-titles.json"

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/api-mongo-project"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port which app will run on
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// new mongoose model:
// this created model shows how the data look like in the database
const Movie = mongoose.model("Movie", {
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

// it will seed the data when reset_db is true, // on terminal reset_db=true run npm dev
if (process.env.RESET_DB) {
  // it is the environment variable
  // async and await is just another method for .then()

  const seedDatabase = async () => {
    // deleti all items in the database to prevent to copy over the items
    await Movie.deleteMany({})

    netflixData.forEach((item) => {
      const newMovie = new Movie(item)
      newMovie.save()
    })
  }
  seedDatabase()
}

// ENDPOINTS
// This is our welcome page endpoint
// if we remove this we see "Cannot GET response in browser" it's built in by express.
//The request (req) is what the frontend sends to the backend. The response (res) is what the backend send to the frontend.
app.get("/", (req, res) => {
  res.send(listEndpoints(app))
})

//
// Collection of Results
// get a list of all the shows (from json file)
app.get("/shows", async (req, res) => {
  const titles = await Movie.find()
  res.json(titles)
})

//
// Single result
// get a specific show based on its title/name --  using param
app.get("/shows/title/:title", async (req, res) => {
  const showByTitle = await Movie.find({ title: req.params.title })

  if (showByTitle) {
    res.json(showByTitle)
  } else {
    res.status(404).json("Sorry, nothing to show with that name!")
  }
})

//... find({ type: "Movie" }).limit(10) shows only 10 of the results
app.get("/shows/movies", async (req, res) => {
  const showMovies = await Movie.find({ type: "Movie" })
  res.json(showMovies)
})

app.get("/shows/tvshows", async (req, res) => {
  const showTvshows = await Movie.find({ type: "TV Show" })
  res.json(showTvshows)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} YOYIII YOY`)
})

// npm install
// npm run dev
// npm i express-list-endpoints
// reset_db=true npm run dev (if it is crashed => kill the terminal and "npm run dev" again)
