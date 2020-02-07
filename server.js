import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import { Netflix } from "./models/Netflix";

// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
import netflixData from "./data/netflix-titles.json";
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// const Netflix = mongoose.model("Netflix", {
//   show_id: Number,
//   title: String,
//   director: String,
//   cast: String,
//   country: String,
//   date_added: String,
//   release_year: Number,
//   rating: String,
//   duration: String,
//   listed_in: String,
//   description: String,
//   type: String
// });

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Netflix.deleteMany({});

    netflixData.forEach(movie => {
      new Netflix(movie).save();
    });
  };

  seedDatabase();
}

// const addMovie = () => {
//   netflixData.forEach(movie => {
//     new Netflix(movie).save();
//   });
// };

// The port the app will run on.
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// .deleteMany().then(() => {

// });

app.get("/netflix", (req, res) => {
  const titleString = req.query.title;
  const castString = req.query.cast;
  const countryString = req.query.country;
  const genreString = req.query.genre;
  const typeString = req.query.type;
  const titleRegex = new RegExp(titleString, "i");
  const castRegex = new RegExp(castString, "i");
  const countryRegex = new RegExp(countryString, "i");
  const genreRegex = new RegExp(genreString, "i");
  const typeRegex = new RegExp(typeString, "i");
  Netflix.find({
    title: titleRegex,
    cast: castRegex,
    country: countryRegex,
    listed_in: genreRegex,
    type: typeRegex
  })
    .sort({ release_year: -1 })
    .limit(20)
    .then(results => {
      // Succesfull
      res.json(results);
    })
    .catch(err => {
      // Error/Failure
      console.log("Error " + err);
      res.json({ message: "Cannot find this search", err: err });
    });
});

app.get("/netflix/_id/:_id", (req, res) => {
  const _id = req.params._id;
  Netflix.findOne({ _id: _id })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      res.json({ message: "Cannot find this movie", err: err });
    });
});

app.get("/netflix/type/:type", (req, res) => {
  const type = req.params.type;
  const typeRegex = new RegExp(type, "i");
  Netflix.find({ type: typeRegex })
    .then(results => {
      res.json(results);
    })

    .catch(err => {
      res.json({ message: "Cannot find any suitable search", err: err });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
