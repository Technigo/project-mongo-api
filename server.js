import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import netflixShows from "./data/netflix-titles.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

//first page
app.get("/", (req, res) => {
 
  const landingPage = {
    Hello: 
    "here is an api with data on some Netflix movies and TV shows",
    Routes: [{
      "/netflixShows": "Get whole array of the Netflix movies and TV shows",
      "/netflixShows/release_year/'year of release'": "Get array of shows from specific release year",
      "/netflixShows/title/'title of show'": "Get one specific show by it's title",
    }]
  }
  res.send(landingPage)
  })

const Show = mongoose.model("Show", {
  //value types, do not go to the database but allows us to create objects that do
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

//await deleteMany stops the db from creating duplicates when refreshed
//means wait for deletion to begin then populate the db anew for every show put in the db
if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Show.deleteMany()
    netflixShows.forEach(singleShow => {
      const newShow = new Show(singleShow)
      newShow.save()
    })
  }
  seedDatabase()
}

app.use(cors());
app.use(express.json())

//error message for database down, server issue 
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})

app.get('/netflixShows', async (req, res) => {
	const findAllShows = await Show.find()
	res.json(findAllShows)
});

//find specific show by exact title
// app.get("/netflixShows/title/:title", async (req, res) => {
//   const { title } = req.params

//   const singleShow = await Show.find({ title: title })
//   res.send(singleShow)
// })

app.get("/netflixShows/title/:title", async (req, res) => {
  try {
    const findByTitle = await Show.find({ title: req.params.title})
    if (findByTitle) {
      res.json(findByTitle)
  } else {
    res.status(404).json({ error: 'Title not found'})
  }
} catch (err) {
  res.status(400).json({ error: 'Invalid title'})
}
})

//find shows by their release year
app.get("/netflixShows/release_year/:release_year", async (req, res) => {
  try {
    const show = await Show.find({ release_year: req.params.release_year.toString() })
    if (show) {
      res.json(show)
  } else {
    res.status(404).json({ error: 'Release year not found'})
  }
} catch (error) {
  res.status(400).json({ error: 'Invalid release year'})
}
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
