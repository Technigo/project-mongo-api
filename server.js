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

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

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
});

if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
    // await User.deleteMany();
    // const testUser = new User({name: "Daniel", age: 28, deceased: false});
    // testUser.save();
  }
  resetDataBase();
}



const port = process.env.PORT || 8080;
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// --- Start of ROUTES ---
// 1st route, the base path.
app.get("/", (req, res) => {
  res.send("Hello Avocado Sales Lover!");
});
// To get all songs.
// app.get("/songs", async (req, res) => {
//  const allTheSongs = await Song.find({});
//  res.status(200).json({
//    success: true,
//    body: allTheSongs
//  })
// });
// 2nd route. To get a specific song, using try-catch code block and the _id.
app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id);
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
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    });
  }

});
// 3rd route. To get a song/songs with specific parameters, using try-catch. The params are; genre & danceability.
// app.get("/songs/genre/:genre/danceability/:danceability", async (req, res) => {
app.get("/songs/", async (req, res) => {

  const {genre, danceability} = req.query;
  const response = {
    success: true,
    body: {}
  }
  const matchAllRegex = new RegExp(".*");
  const genreQuery = genre ? genre : matchAllRegex;
  const danceabilityQuery = danceability ? danceability : matchAllRegex;

  try {
    //if (req.params.genre && req.params.danceability) {
      response.body = await Song.find({genre: genreQuery, danceability: danceabilityQuery}).limit(2).sort({energy: 1}).select({trackName: 1, artistName: 1})
      // .exec() => to explore if you're curious enough :P
    // } else if (req.params.genre && !req.params.danceability) {
    //  response.body = await Song.find({genre: req.params.genre});
    // } else if (!req.params.genre && req.params.danceability) {
    //  response.body = await Song.find({danceability: req.params.danceability});
    // }
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
// --- End of ROUTES ---


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
// The connection string that I will need:
// mongodb+srv://Maria:<password>@cluster0.0cj9ggy.mongodb.net/?retryWrites=true&w=majority

// RESET_DB=true npm run dev
// Go here:
// https://github.com/coreybutler/nvm-windows/releases
// download nvm-setup.exe
// run as admin
// open cmd as admin
// type nvm install v16.18.1
// https://mongoosejs.com/docs/queries

// https://regex101.com = regular expression

// /yourWordOfChoice/gm - regex to match yourWordOfChoice
// /.*/gm - regex to match every character in a string