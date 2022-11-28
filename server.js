import express from "express";
import cors from "cors";
import mongoose from "mongoose";


// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const User = mongoose.model("User", {
  name: String,
  age: Number,
  deceased: Boolean
});

const Song = mongoose.model("Song", {
  id: Number,
    trackName: String,
    artistName: String,
    genre: String,
    bpm: Number,
    energy: Number,
    danceability: Number,
    loudness: Number,
    liveness: Number,
    valence: Number,
    length: Number,
    acousticness: Number,
    speechiness: Number,
    popularity: Number
})


if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song (singleSong)
      newSong.save();
    });
    await User.deleteMany();
    const testUser = new User({ 
      name: "Daniel", 
      age: 28, 
      deceased: false });
    testUser.save(); 
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
  res.send("Hello Technigo!");
});

// app.get("/songs", async (req, res) => {
//   const allTheSongs = await Song.find({}) //to find all the songs
//   res.status(200).json({
//     success: true,
//     body: allTheSongs
//   });
// });

app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id)
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the song"
        }
      });
    }
  } 
  catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    });
  }
});

// app.get("/songs/genre/:genre/danceability/:danceability", async (req, res) 
app.get("/songs/", async (req, res) => {
  const {genre, danceability} = req.query /* req.params */; //deconstructing
  const response = { //this line of code replaces the commented away snippets in try section
    success: true,
    body: {}
  }

  const matchAllRegex = new RegExp(".*");
  const matchAllNumbersGreaterThanZero = { $gt: 0 };
  const danceabilityQuery = danceability ? danceability : matchAllNumbersGreaterThanZero;;
  const genreQuery = genre ? genre : matchAllRegex;
  try {
    // if (req.params.genre && req.params.danceability) {
      /* const allMatchingSongs */ response.body = await Song.find({genre: genreQuery /* req.params.genre */, danceability: danceabilityQuery})/* req.params.danceability */.limit(2).sort({energy: 1})//if we would have -1 then it is descending order
      .select({trackName: 1, artistName: 1}) /* you only want to display those two, if you put -1 you want to extract/hide those */
      // res.status(200).json({
      //   success: true,
      //   body: allMatchingSongs
      // });
    // } else if (req.params.genre && !req.params.danceability) {
    //   const allMatchingSongs response.body = await Song.find({genre: req.params.genre})
      // res.status(200).json({
      //   success: true,
      //   body: allMatchingSongs
      // });
    // } else if (!req.params.genre && req.params.danceability) {
      /* const allMatchingSongs */ /* response.body = await Song.find({danceability: req.params.danceability});
    } */
      res.status(200).json({
        success: true,
        body: response
      });
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: error
      }
    });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
