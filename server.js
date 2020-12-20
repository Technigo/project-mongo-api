import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import data from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/shows";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

const Show = mongoose.model("Show", {
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String,
});

if (process.env.RESET_DATABASE) {
  console.log("Resetting database");
  const seedDataBase = async () => {
    await Show.deleteMany({});
    data.forEach((item) => {
      const newShow = new Show(item);
      newShow.save();
    });
  };
  seedDataBase();
  console.log(seedDataBase);
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Route to list all the content in the show array
app.get("/shows", async (req, res) => {
  const shows = await Show.find();
  res.json(shows);
});

app.get("/shows/:title", async (req, res) => {
  const searchTitle = await Show.findOne({ title: req.params.title });
  if (searchTitle) {
    res.json(searchTitle);
  } else {
    res.status(404).json({ error: "Title not found" });
  }
});

app.get("/shows/releaseyear/:releaseyear", async (req, res) => {
  const releaseyear = await Show.find({
    release_year: req.params.releaseyear,
  });
  if (releaseyear) {
    res.json(releaseyear);
  } else {
    res.status(404).json({ error: "Year not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
