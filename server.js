import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

import musicData from "./data/top-music.json";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defining model
const topMusicSchema = new mongoose.Schema({
  id: Number,
  trackName: {
    type: String,
    lowercase: true
  },
  artistName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    lowercase: true
  },
  genre: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  lenght: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
});

const TopMusic = mongoose.model("TopMusic", topMusicSchema);

const artistSchema = new mongoose.Schema({
  artistName: String
});

const Artist = mongoose.model("Artist", artistSchema);

// // seedDB
// if (process.env.RESET_DB) {
//   const seedDB = async () => {
//     await TopMusic.deleteMany();
//     await Artist.deleteMany();

//     const artistsArray = [];

//     musicData.forEach(async (item) => {
//       const newArtist = new Artist(item);
//       artistsArray.push(newArtist);
//       await newArtist.save();
//     });

//     musicData.forEach(async (item) => {
//       const newTopMusic = new TopMusic({
//         ...item,
//         artistName: artistsArray.find(
//           (singleArtist) => singleArtist.artistName === item.artistName
//         )
//       });
//       await newTopMusic.save();
//     });
//   };
//   seedDB();
// }

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// // check connection
// app.use((req, res, next) => {
//   if (mongoose.connection.readyState === 1) {
//     next();
//   } else {
//     res.status(503).json({ error: "Service not available" });
//   }
// });

// show all endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// Endpoint to get the whole music list
app.get("/topmusics", async (req, res) => {
  const topmusics = await TopMusic.find();
  if (topmusics) {
    res.json(topmusics);
  } else {
    res.status(404).json({ errro: "Music list was not found" });
  }
});

// // Endpoint to filter artists by name using query params
// // app.get("/topmusics", async (req, res) => {
// //   const { name } = req.query;
// //   try {
// //     if (name) {
// //       const artist = await TopMusic.find({
// //         artistName: {
// //           $regex: new RegExp(name, "i")
// //         }
// //       });
// //       res.json(artist);
// //     } else {
// //       const artist = await TopMusic.find();
// //       res.json(artist);
// //     }
// //   } catch (error) {
// //     res.status(400).json({ error: "invalid request" });
// //   }
// // });

// // Endpoint to find music by id using path params
// app.get("/topmusics/:musicId", async (req, res) => {
//   try {
//     const { musicId } = req.params;
//     const singleMusic = await TopMusic.findById(musicId);
//     if (singleMusic) {
//       res.json(singleMusic);
//     } else {
//       res.status(404).send({ error: "Id not found" });
//     }
//   } catch (err) {
//     res.status(400).send({ error: "Invalid request" });
//   }
// });

// // Endpoint to find track using path param
// app.get("/topmusics/track/:trackName", async (req, res) => {
//   try {
//     const { trackName } = req.params;
//     const singleTrack = await TopMusic.findOne({ trackName });
//     if (singleTrack) {
//       res.json(singleTrack);
//     } else {
//       res.status(404).send({ error: "track not found" });
//     }
//   } catch (err) {
//     res.status(400).send({ error: "Invalid request" });
//   }
// });

// // Endpoint to get all artists
// app.get("/artists/:artistID", async (req, res) => {
//   const { artistID } = req.params
//   try {
//     const artist = await Artist.findById(artistID)
//     if (artist) {
//       res.json({ data: artist });
//     } else {
//       res.status(404).send({ error: `Artist ${artistID} not found` });
//     }
//   } catch (err) {
//     res.status(400).send({ error: "invalid request" });
//   }
// });

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
