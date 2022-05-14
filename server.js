import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import netflixShows from "./data/netflix-titles.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

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

  //await deleteMany means wait for deletion to begin then populate the db anew for every show put in the db
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
	const shows = await Show.find()
	res.json(shows)
});

//find specific show by exact title
app.get("/netflixShows/title/:title", async (req, res) => {
  const { title } = req.params

  const singleShow = await Show.find({ title: title })
  res.send(singleShow)
})

app.get("/listed_in/:listed_in", async (req, res) => {
  try {
    const show = await Show.find(req.params.listed_in)
    if (show) {
      res.json(show)
  } else {
    res.status(404).json({ error: 'Show category not found'})
  }
} catch (err) {
  res.status(400).json({ error: 'Invalid show category'})
}
})

app.get("netflixShows/release_year/:release_year", async (req, res) => {
  try {
    const show = await Show.find(req.params.release_year.toString())
    if (show) {
      res.json(show)
  } else {
    res.status(404).json({ error: 'Realese year not found'})
  }
} catch (err) {
  res.status(400).json({ error: 'Invalid realese year'})
}
})


// app.get("/shows/show/:cast", async (req, res) => {
//   //this will retrieve only the first show from specific actor
//   const findByCast = await Show.findOne({cast: req.params.cast})
//   res.send(findByCast)
// })
// This only works if only one actor in crew like Christian Morales, needs includes for Winona Ryder etc.


//query path: http://localhost:8080/netflixShows/show?title=Stranger%20Things&realese_year=2019

app.get("/netflixShows/show", async (req, res) => {
  const {title, realese_year} = req.query
  const findByStuff = await Show.find({title: title, 
    realese_year: realese_year})
  res.send(findByStuff)
})

app.get("/songs/song", async (req, res) => {
  const {artistName, trackName, energy} = req.query
  console.log("artistName", artistName)

  // const artistNameRegex = new RegExp(artistName, "i")
  // const trackNameRegex = new RegExp(trackName, "i")
  // const energyRegex = new RegExp(energy, "i")

  if (trackName) {
    const singleSong = await Song.find({artistName: artistName, trackName: trackName, energy: energy})
    res.send(singleSong)
  } else {
    const singleSong = await Song.find({artistName: artistName})
    res.send(singleSong)
  }
})

//http://localhost:8080/songs/song?artistName=Marshmello&trackName=Happier&energy=79 

// http://localhost:8080/songs/song?artistName=Marshmello&trackName=Happier -> one song from one artist
// http://localhost:8080/songs/song?trackName=Happier -> a song with a given name
// http://localhost:8080/songs/song?artistName=Marshmello -> all songs from given artist
 

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Hello world`)
  console.log(`Server running on http://localhost:${port}`);
});
