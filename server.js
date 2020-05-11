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

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    // raderar så det ej läggs till varje gång man laddar sida.
    await Track.deleteMany({});

    data.forEach((trackData) => {
      new Track(trackData).save();

      ///await tracksData.forEach((track) => new Track(track).save());
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
  res.send("Hello WORLD");
});

app.get("/tracks", async (req, res) => {
  const tracks = await Track.find();
  //console.log(tracks);
  res.json(tracks);
});

app.get("/tracks/:trackName", async (req, res) => {
  const { trackName } = req.params;
  const track = await Track.findOne({ trackName: trackName });
  if (Track) {
    res.json(track);
  } else {
    res
      .status(404)
      .json({ error: `Could not find track with id=${trackName}` });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
