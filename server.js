import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import anime from "./data/anime.json"
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
//import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/anime";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

/* const User = mongoose.model("User", {
  name: String,
  age: Number,
  deceased: Boolean
}); */

const Anime = mongoose.model("Anime",
{
  id: Number,
  title: String,
  synonyms: String,
  japanese: String,
  english: String,
  synopsis: String,
  type: String,
  episodes: Number,
  status: String,
  start_Aired: String,
  end_Aired: String,
  premiered: String,
  broadcast: String,
  producers: String,
  licensors: String,
  studios: String,
  source: String,
  genres: String,
  themes: String,
  demographics: String,
  duration_Minutes: Number,
  rating: String,
  score: Number,
  scored_Users: Number,
  ranked: Number,
  popularity: Number,
  members: Number,
  favorites: Number
}
)

if(process.env.RESET_DB){
  const resetDataBase = async () => {
    await Anime.deleteMany();
    anime.forEach(singleAnime => {
      const newAnime = new Anime(singleAnime);
      newAnime.save()
    })
  }
  resetDataBase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send([
    {"/": "Anime Playground"},
    {"/animes": "Display all animes"},
    {"/animes/:anime": "Anime title in English"},
    {"/animes/:animejapan": "Anime title in Japanese"},
    {"/popular": "Sorting anime by popularity"},
    {"/animes/:studio": "Find anime with specific studio producer"}
  ]);
});

// Display all animes
// example 
app.get("/animes", async (req, res) => {
  const animes = await Anime.find()
  res.status(200).json({
    data: animes,
    success: true,
  })
})

// Display one anime by title
// example /animes/Naruto
app.get("/animes/:title", async (req, res) => {
  let animeTitle = await Anime.findOne({ title: req.params.title })

  if(animeTitle){
    res.status(200).json({
    data: animeTitle,
    success: true,
  })
} else {
    res.status(404).send({
    data: "Title not found. Check upper & lowercase",
    success: false 
    })}
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
