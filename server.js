import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

// This is the model of how it should look in the data-base
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
  popularity: Number,
});

//Async await function to have the database to reload only when I call the function
if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    // waiting for the database to delete users before adding new
    await Song.deleteMany();
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong);
      newSong.save();
    });
  };
  resetDataBase();
}

const port = process.env.PORT || 8080;
const app = express();

// To list all endpoints in the app
// const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  const firstPage = {
    Hello: "Welcome to my MongoDB API with a list of popular song on spotify",
    Routes: [
      {
        "/songs": "Get the whole array of songs",
      },
    ],
  };
  res.send({ firstPage });
});

// Songs endpoint
// app.get("/songs", async (req, res) => {
//   // What quearies to use https://mongoosejs.com/docs/queries
//   const allSongs = await Song.find({});
//   res.status(200).json({
//     success: true,
//     message: "OK",
//     body: { topMusicData: allSongs },
//   });
// });

// multiple path params
// app.get("/songs/genre/:genre/danceability/:danceability", async (req, res) => {
// Queary params
app.get("/songs/", async (req, res) => {
  console.log("/songs req", req.query);

  const { genre, danceability } = req.query;
  const response = {
    success: true,
    body: {},
  };

  const matchAllRegex = new RegExp(".*");
  const genreQuery = genre ? genre : matchAllRegex;
  const danceabilityQuery = danceability ? danceability : /.*/;

  try {
    // if ( req.params.genre && req.params.danceability) {
    // let songs;
    // if (genre) {
    //   songs = await Song.find({
    //     genre: genreQuery,
    //   });
    // }
    // if (danceability) {
    //   songs = await Song.find({
    //     danceability: danceabilityQuery,
    //   });
    // }
    // response.body = songs;
    response.body = await Song.find({
      // danceability: danceabilityQuery,
      genre: genreQuery,
    });

    // .limit(2);
    // .sort({ energy: 1 })
    // .select({ trackName: 1, artistName: 1 });
    //.exec() => to explore if you're curious enough :P
    // } else if (req.params.genre && !req.params.danceability) {
    //   response.body = await Song.find({genre: req.params.genre});
    // } else if (!req.params.genre && req.params.danceability) {
    //   response.body = await Song.find({danceability: req.params.danceability});
    // }
    res.status(200).json({
      success: true,
      body: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: error,
      },
    });
  }
});

app.get("/songs/id/:id", async (req, res) => {
  // try catch block to catch reponses
  try {
    const singleSong = await Song.findById(req.params.id);
    if (singleSong) {
      res.status(200).json({
        success: true,
        message: "OK",
        body: singleSong,
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the song",
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id",
      },
    });
  }
});

// Queary Params for artist name and song title
app.get("/artists", async (req, res) => {
  const artist = await Song.find();
  // const artist = Song.map((index) => index.artistName).sort();
  res.status(200).json(artist);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// run the server again to reset database with: RESET_DB=true npm run dev
// https://mongoosejs.com/docs/queries - look it up
// Regular expressions, test on this website
// https://regex101.com/
// /yourWodOfChoice/gm - regex to match yourWordOfChoice
// /.*/gm - regex to match every character in a string
