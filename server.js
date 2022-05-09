import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
 import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// const User = mongoose.model("User", {
//   name: String,
//   age: Number,
//   deceased: Boolean
// })

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
// })

const Title = mongoose.model("Title", {
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

// const secondTesteUser = new User({name: "Daniel", age: 27, deceased: false})
// secondTesteUser.save()

// if(process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     await Song.deleteMany()
//     topMusicData.forEach( singleSong => {
//       const newSong = new Song(singleSong)
//       newSong.save()
//     })
//   }
//   seedDatabase()
// }

if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Title.deleteMany()
    netflixData.forEach( singleTitle => {
      const newTitle = new Title(singleTitle)
      newTitle.save()
    })
  }
  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json(netflixData)
})

app.get('/:title', (req, res) => {
  const allTitles = netflixData.find(data => data.title === req.params.title)

  res.status(200).json(allTitles)
})

app.get('/movies', (req, res) => {
  const movies = netflixData.filter(movie => movie.type === 'Movie')

  res.status(200).json(movies)
})

// app.get('/movies', async (req, res) => {
//   const movies = await Title.find()
//   res.json(movies)
// })

app.get('/movies/:title', (req, res) => {

  const { title } = req.params

  const movieByName = netflixData.find(movie => movie.type === 'Movie' && movie.title === title)

  if (!movieByName) {
    res.status(404).json('Not found') 
  } else {
    res.status(200).json(movieByName)
  } 

  res.status(200).json(movieByName)
})

app.get('/tvshows', (req, res) => {
  const tvShows = netflixData.filter(show => show.type === 'TV Show')

  res.status(200).json(tvShows)
})

app.get('/tvshows/:title', (req, res) => {

  const { title } = req.params

  const tvShowByName = netflixData.find(show => show.type === 'TV Show' && show.title === title)

  if (!tvShowByName) {
    res.status(404).json('Not found') 
  } else {
    res.status(200).json(tvShowByName)
  }  
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
