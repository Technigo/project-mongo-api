import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import anime from "./data/anime.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/anime";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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
    /* await Anime.deleteMany(); */
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
    {"/animes/title/:english": "One anime title displayed for other countries than Japan"},
    {"/animes/highscore": "Sorting anime by popularity"},
    {"/animes/type/:type": "Find anime with specific type"},
    {"/animes/status?query={status}": "Find anime with specific status"},
    {"/animes/studios/:studio?premiered={premiered}": "Find anime with specific studio producer and then can filter more depending on when it is premiered"}
  ]);
});

// Display all animes
app.get("/animes", async (req, res) => {
  const animes = await Anime.find()
  res.json(animes)
})

// Display one anime by title
// example /animes/naruto
app.get("/animes/title/:english", async (req, res) => {
  const titleRegex = new RegExp(req.params.english, "i");
  
  const animeTitle = await Anime.findOne({ english: titleRegex })

  if(animeTitle){
    res.status(200).json({
    data: animeTitle,
    success: true,
  })
} else {
    res.status(404).send({
    data: "Title not found",
    success: false 
    })}
})

// Display animes by its score
// example /animes/highscore
app.get("/animes/highscore", async (req, res) => {
  const animeScore = await Anime.find({score: { $gte: 8 }})

  if(animeScore){
    res.status(200).json({
    data: animeScore,
    success: true,
  })
} else {
    res.status(404).send({
    data: "Error",
    success: false 
    })}
})

// Display animes by its type
// example /animes/type
app.get("/animes/type/:type", async (req, res) => {
 try{
  const typeRegex = new RegExp(req.params.type, "i");
  const animeType = await Anime.find({ type: typeRegex }).limit(5).sort({score: -1}).select({title: 1, synopsis: 1, score: 1})

  if(animeType){
    res.status(200).json(animeType)
  } else{
    res.status(404).json({
      success: false,
      body: {
        message: "invalid"
      }
    })
  } 
} catch(error){
  res.status(400).json({
    success: false,
    body: {
      message: "bad request"
  }})
}

  
})

// /anime/status?query=Currently Airing
app.get("/animes/status", async(req, res) => {
  const { query } = req.query;
  const queryRegex = new RegExp(query, 'i')
  const status = await Anime.find({ status: queryRegex })
  if(status.length > 0){
    res.json(status)
  }else{
    res.status(404).json('error')
  }
})

// example /animes/studios/white%20fox?premiered=fall%202018
app.get("/animes/studios/:studios", async (req, res) => {
  const studioRegex = new RegExp(req.params.studios, "i");
  const premieredRegex = new RegExp(req.query.premiered, "i")
  const animeStudio = await Anime.find({ 
    studios: studioRegex,
  premiered: premieredRegex
})
  res.status(200).json(animeStudio)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
