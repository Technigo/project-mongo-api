import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import { Netflix } from "./models/Netflix";

import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Netflix.deleteMany({});

    netflixData.forEach(movie => {
      new Netflix(movie).save();
    });
  };

  seedDatabase();
}

// The port the app will run on.
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

//ROUTES and QUERIES
app.get("/netflix", async (req, res) => {
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 10
  };
  const titleRegex = new RegExp(req.query.title, "i");
  const castRegex = new RegExp(req.query.cast, "i");
  const countryRegex = new RegExp(req.query.country, "i");
  const genreRegex = new RegExp(req.query.genre, "i");
  const typeRegex = new RegExp(req.query.type, "i");
  const searchNetflix = await Netflix.find({
    title: titleRegex,
    cast: castRegex,
    country: countryRegex,
    listed_in: genreRegex,
    type: typeRegex
  })
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({ release_year: -1 });

  if (searchNetflix) {
    res.json(searchNetflix);
  } else {
    res.status(404).json({ error: "Cannot find this search" });
  }
});

app.get("/netflix/_id/:_id", async (req, res) => {
  const _id = req.params._id;

  const findId = await Netflix.findOne({ _id: _id });

  if (findId) {
    res.json(findId);
  } else {
    res.status(404).json({ error: "Cannot find this movie" });
  }
});

app.get("/netflix/type/:type", async (req, res) => {
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 10
  };
  const typeRegex = new RegExp(req.params.type, "i");

  const findType = await Netflix.find({ type: typeRegex })
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({ release_year: -1 });

  if (findType) {
    res.json(findType);
  } else {
    res.status(404).json({ error: "Cannot find any suitable search" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
