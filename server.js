import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Artist = mongoose.model("Artist", {
  artistName: String,
  genre: String,
  popularity: Number,
});

const Track = mongoose.model("Track", {
  trackName: String,
  length: Number,
  danceability: Number,
});

/*const Genre = mongoose.model("Genre", {
  genre: String,
});*/

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Artist.deleteMany({});
    await Track.deleteMany({});
    //await Genre.deleteMany({});

    topMusicData.forEach((topMusicData) => {
      new Artist(topMusicData).save();
      new Track(topMusicData).save();
      //new Genre(topMusicData).save();
    });
  };

  seedDatabase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  // Displays all movies and shows
  res.json(topMusicData);
  //res.send("Hello Kajsa");
});

app.get("/artists", async (req, res) => {
  const Artist = await Artist.find();
  console.log(artists);
  res.json(artists);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
