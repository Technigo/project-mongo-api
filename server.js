import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
// app.use((req, res, next) => {
//   mongoose.connection.readyState !== 1
//     ? next()
//     : res.status(503).json({ error: "Service Unavailable" });
// });

//Something here is wrong
app.use((req, res, next) => {
  mongoose.connection.readyState === 1
    ? next()
    : res.status(503).json({ error: "Service Unavailable" });
});

// Mongoose object models
// const Title = mongoose.model("Title", {
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
//   type: String,
// });

const Title = mongoose.model("Title", {
  show_id: Number,
  title: String,
  director: String,
  cast: [String],
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: [String],
  description: String,
  type: String,
});

const Categories = mongoose.model("Categories", {
  name: String,
});

const categorySeeder = async () => {
  await Categories.deleteMany();
  let listOfCategories = [];
  let cleanList = [];

  await netflixData.map((category) => {
    if (
      !listOfCategories.includes(
        category.listed_in.split(",").map((category) => category.trim())
      )
    ) {
      listOfCategories.push(
        category.listed_in.split(",").map((category) => category.trim())
      );
    }
  });

  for (let box of listOfCategories) {
    for (let cate of box) {
      if (!cleanList.includes(cate)) {
        cleanList.push(cate);
      }
    }
  }

  cleanList.map((cat) => new Categories({ name: cat }).save());
};

const seeder = async () => {
  await Title.deleteMany();

  await netflixData.map((title) =>
    new Title({
      show_id: title.show_id,
      title: title.title,
      director: title.director,
      cast: title.cast.split(", "),
      country: title.country,
      date_added: title.date_added,
      release_year: title.release_year,
      rating: title.rating,
      duration: title.duration,
      listed_in: title.listed_in.split(", "),
      description: title.description,
      type: title.type,
    }).save()
  );
};

//Seed DB
// Title.deleteMany().then(() => {
//   seeder();
// });
// categorySeeder();
// seeder();
// Start defining your routes here
app.get("/", (req, res) => {
  // res.send("Hello Technigo!");
  res.send(listEndpoints(app));
});

app.get("/titles", (req, res) => {});

app.get("/titles/:id", async (req, res) => {
  try {
    const title = await Title.findById(req.params.id);

    user ? res.json(title) : res.status(404).send({ error: "Title not found" });
  } catch (err) {
    res.status(400).json({ error: `${err}` });
  }
});

app.get("/categories/", (req, res) => {
  let categoryList = [];
  const categories = netflixData.map((title) =>
    title.listed_in
      .split(",")
      .map((category) => category.trim().replace(/ /g, "-").toLowerCase())
  );

  for (let box of categories) {
    for (let cate of box) {
      if (!categoryList.includes(cate)) {
        categoryList.push(cate);
      }
    }
  }
  // res.send(categories);
  res.send(categoryList);
});

app.get("/categories/:titleCategory", (req, res) => {
  const titleCategory = req.params.titleCategory.toLowerCase();
  const catCheck = netflixData.filter((cat) => {
    return cat.listed_in
      .toLowerCase()
      .replace(/ /g, "-")
      .includes(titleCategory);
  });

  catCheck.length > 0
    ? res.json(catCheck)
    : res.status(404).send("Sorry, we have nothing in this category.");
});

//404 page
app.use((req, res) => {
  res.send(`<div><h1>Oops, this page doesn't exist 👻</h1>`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
