import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import data from "./data/top-music.json";

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Track = mongoose.model("Track", {
  artistName: String,
  trackName: String,
  genre: String,
  popularity: Number,
  length: Number,
  danceability: Number,
  id: Number,
});

/*const Track = mongoose.model("Track", {
  trackName: String,
  length: Number,
  danceability: Number,
});*/

/*const Genre = mongoose.model("Genre", {
  genre: String,
});*/

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    // raderar så det ej läggs till varje gång man laddar sida.
    await Track.deleteMany({});
    //await Track.deleteMany({});
    //await Genre.deleteMany({});

    data.forEach((artistData) => {
      new Track(artistData).save();
      //new Track(artistdata).save();
      //new Genre(topMusicData).save();
    });
  };

  seedDatabase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  // Displays all movies and shows
  //res.json(data);
  res.send("Hello Kajsa");
});

/*app.get("/tracks", async (req, res) => {
  const tracks = await Track.find();
  console.log(tracks);
  res.json(tracks);
});*/

app.get("/tracks", async (req, res) => {
  const tracks = await Track.find();
  console.log(tracks);
  res.json(tracks);
});
// this artist search works : http://localhost:8080/artists

app.get("/tracks/:id", async (req, res) => {
  const tracks = await Track.findById(req.params.id);
  if (tracks) {
    res.json(tracks);
  } else {
    res.status(404).json({ error: "Track not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
