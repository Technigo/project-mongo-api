import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import albumData from "./data/rolling-stone-top-500-albums.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

const Album = new mongoose.model("Album", {
  position: Number,
  artist: String,
  albumName: String,
  label: String,
  year: Number,
  critic: String,
});

if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Album.deleteMany(); //DeleteMany is a method provided by Mongoose package

    albumData.forEach(item => {
      const newAlbum = new Album(item);
      newAlbum.save(); //Save is a method from Mongoose
    });
  };
  populateDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

// app.get("/albums", async (req, res) => {
//   const { artist, year, label } = req.query;

//   let albums = await Album.find({
//     artist: new RegExp(artist, "i"),
//     year: { $eq: year },
//     label: new RegExp(label, "i"),
//   });
//   res.json(albums);
// });

app.get("/albums", async (req, res) => {
  const queryParameters = req.query;
  console.log(queryParameters);

  const allAlbums = await Album.find(req.query);
  res.json(allAlbums);
});

app.get("/albums/:album", async (req, res) => {
  // const { album } = req.params;
  // if (album) {
  //   const findAlbum = await Album.findOne({ albumName: req.params.album });
  //   res.json(findAlbum);}
  const singleAlbum = await Album.findOne({ albumName: req.params.album });
  res.json(singleAlbum);
});

app.get("/albums/artist");

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
