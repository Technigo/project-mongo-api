import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";

import topMusicData from "./data/top-music.json";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || `mongodb+srv://Font:${process.env.STRING_PW}@cluster0.8xh88s6.mongodb.net/projectMongo?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

// This is the first model. It's not putting info into the DB. It specify the types
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

// Deleting DB is in this case for educational porpouses. 
// And then populating it with Songs
if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
  }
  resetDataBase();
};

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.status(200).json({
    Message: "Top-Music data",
    data: listEndpoints(app)
  });
});

// This will return an array of all songs and handles status 200
app.get("/songs", async (req, res) => {
  const songs = await Song.find({});
  res.status(200).json({
    success: true,
    message: "OK",
    body: {
      topMusicData: songs
    }
  });
});

// FindByID is the quiquest search
// This returns a single song by ID
app.get("/songs/id/:id", async (req, res) => {
  try {
    const songById = await Song.findById(req.params.id);
    if (songById) {
      res.status(200).json({
        success: true,
        message: "OK",
        body: {
          topMusicData: songById
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Song Not found",
        body: {
          topMusicData: {}
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid id",
      body: {
        topMusicData: {}
      }
    });
  }
});

// This will return a single song sorted by trackname.
// Handles 404 and 400
app.get("/songs/trackname/:trackname", async (req, res) => {
  try {
    const singleTrack = await Song.find({ trackName: req.params.trackname });
    if (singleTrack) {
      res.status(200).json({
        succes: true,
        message: "OK",
        body: {
          singleTrack: singleTrack
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Track not found",
        body: {
          singleTrack: {}
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid trackname",
      body: {
        singleTrack: {}
      }
    });
  }
});

//This will create daceablity and genre query.

app.get("/songsquery/", async (req, res) => {
  const { danceability, genre, } = req.query;
  const response = {
    succes: true,
    body: {}
  }

  const matchAllRegex = new RegExp(".*");
  const matchAllNumbersGreaterThanZero = { $gt: 0, $lt: 100 };
  const genreQuery = genre ? genre : matchAllRegex;
  const danceabilityQuery = danceability ? danceability : matchAllNumbersGreaterThanZero;

  try {
    response.body = await Song.find({ danceability: danceabilityQuery, genre: genreQuery }).limit(3)/* .sort({ energy: 1 }).select({ trackName: 1, artistName: 1 }) */
    res.status(200).json({
      success: true,
      message: "OK",
      body: {
        message: response
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "error",
      body: {
        message: error
      }
    });
  }
});

// This is an experiment for learning porpouses.
// It returns a list of all songs or artists based on queries.
// Right now is working cause data is from json. 
// But with this error: Error: Cannot set headers after they are sent to the client
// I'm trying to do the same with the model. Not working. (look at bottom)

app.get("/lists", (req, res) => {
  const { songlist, artistlist } = req.query;
  if (songlist) {
    const songlist = topMusicData.map((song) => song.trackName)
    res.status(200).json({
      success: true,
      message: "OK",
      response: {
        songList: songlist,
      }
    });
  }
  if (artistlist) {
    const artistList = topMusicData.map((artist) => artist.artistName)
    res.status(200).json({
      success: true,
      message: "OK",
      response: {
        songList: artistList,
      }
    });
  }
  res.status(200).json({
    success: true,
    message: "OK",
  });
})

// This will return all songs from the same artist.
// Handles 404 and 400
app.get("/songs/artistname/:artistname", async (req, res) => {
  try {
    const singleArtist = await Song.find({ artistName: req.params.artistname })
    if (singleArtist) {
      res.status(200).json({
        success: true,
        message: "OK",
        response: {
          singleArtist: singleArtist
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Artist not found",
        response: {}
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid artist",
      body: {
        singleArtist: {}
      }
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// NOTES

// REGEX -- https://regex101.com/
// /.*/gm - regex to match every character in a string.
// /yourWordOfChoice/gm - regex to match your yourWordOfChoice

// Trying to make this work.

// app.get("/lists/", async (req, res) => {
//   const { songlist, artistlist } = req.query;
//   try {
//     const { songListData, artistListData } = await Song.find({})
//     const songListMap = songListData.forEach((song) => song.trackName)
//     const artistListMap = artistListData.forEach((artist) => artist.artistName)

//     if (songlist) {
//       res.status(200).json({
//         success: true,
//         message: "OK",
//         response: {
//           songList: songListMap,
//         }
//       });
//     }
//     if (artistlist) {
//       res.status(200).json({
//         success: true,
//         message: "OK",
//         response: {
//           songList: artistListMap,
//         }
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "OK",
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Invalid listname",
//       body: {
//         topMusicData: {}
//       }
//     });
//   }
// });
