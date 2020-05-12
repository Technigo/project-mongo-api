import express, { query } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import data from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Show = mongoose.model("Show", {
  show_id: { type: Number },
  title: { type: String },
  director: { type: String },
  cast: { type: String },
  country: { type: String },
  date_added: { type: String },
  release_year: { type: String },
  rating: { type: String },
  duration: { type: String },
  listed_in: { type: String },
  description: { type: String },
  type: { type: String },
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Show.deleteMany();

    data.forEach((showData) => {
      new Show(showData).save();
    });
  };

  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

const listEndpoints = require("express-list-endpoints");

// Start defining your routes here

app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/shows", async (req, res) => {
  const { page, title, director, cast, country, year, genre, type } = req.query;

  const pageNo = +page || 1;
  const perPage = 10;
  const skip = perPage * (pageNo - 1);

  const searchShow = await Show.find({
    title: new RegExp(title, "i"),
    director: new RegExp(director, "i"),
    cast: new RegExp(cast, "i"),
    country: new RegExp(country, "i"),
    release_year: new RegExp(year, "i"),
    listed_in: new RegExp(genre, "i"),
    type: new RegExp(type, "i"),
  })
    .sort({ release_year: -1 })
    .limit(perPage)
    .skip(skip);

  if (searchShow) {
    res.json(searchShow);
  } else {
    res.status(404).json({ error: "Cannot find this search" });
  }
});

app.get("/shows/:show_id", async (req, res) => {
  const { show_id } = req.params;
  const showById = await Show.findOne({ show_id: show_id });

  if (showById) {
    res.json(showById);
  } else {
    res
      .status(404)
      .json({ error: `Content with id number: ${showById} not found` });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
