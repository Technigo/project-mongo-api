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

const populateDatabase = () => {
  Album.deleteMany(); //DeleteMany is a method provided by Mongoose package
};

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
