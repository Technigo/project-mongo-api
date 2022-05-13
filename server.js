import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import netflixShows from "./data/netflix-titles.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// const Song = mongoose.model("Song", {
//   id: Number,
//   trackName: String,
//   artistName: String,
//   genre: String,
//   bpm: Number,
//   energy: Number,
//   danceability: Number,
//   loudness: Number,
//   liveness: Number,
//   valence: Number,
//   length: Number,
//   acousticness: Number,
//   speechiness: Number,
//   popularity: Number 
//   })

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

  //await deleteMany means wait for deletion to begin then populate the db anew for every song put in new record in the db
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

  // if(process.env.RESET_DB) {
  //   const seedDatabase = async () => {
  //     await Song.deleteMany();
  //     topMusicData.forEach( singleSong => {
  //       const newSong = new Song(singleSong);
  //       newSong.save();
  //     })
  //   }
  //   seedDatabase();
  // }

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

app.get('/shows', async (req, res) => {
	const shows = await Show.find()
	res.json(shows)
});

//find specific show by exact title
app.get("/title/:title", async (req, res) => {
  const { title } = req.params

  // const singleShow = await Show.find(
  //   (Show) => Show.title.toLowerCase().includes(title.toLowerCase())
  //   )

  // const singleShow = await netflixShows.filter(
  //   (show) => show.title.toLowerCase().includes(title.toLowerCase())
  //   )

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


app.get("/authors/id/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.json(author)
    } else {
      res.status(404).json({ error: "Author not found" })
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid author id" })
  }
});




app.get("/release_year/:release_year", async (req, res) => {
  try {
    const show = await Show.find(req.params.release_year)
    if (show) {
      res.json(show)
  } else {
    res.status(404).json({ error: 'Realese year not found'})
  }
} catch (err) {
  res.status(400).json({ error: 'Invalid realese year'})
}
})



app.get("/songs/song/:artistName", async (req, res) => {
  //this will retrieve only the first song
  const singleSong = await Song.findOne({artistName: req.params.artistName})
  res.send(singleSong)
})

app.get("/songs/song/:artistName", async (req, res) => {
  //this will retrieve all artists songs
  const singleSong = await Song.find({artistName: req.params.artistName})
  res.send(singleSong)
})

//query path: http://localhost:8080/songs/song?artistName=Marshmello&trackName=Happier&energy=79
app.get("/songs/song", async (req, res) => {
  const {artistName, trackName, energy} = req.query
  const singleSong = await Song.find({artistName: artistName, 
    trackName: trackName, 
    energy: energy})
  res.send(singleSong)
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
