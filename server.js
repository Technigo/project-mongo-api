import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import titleRoutes from "./routes/titleRoutes";

import netflixData from "./data/netflix-titles.json";
import { TitleModel } from "./models/Title";

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
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  mongoose.connection.readyState === 1
    ? next()
    : res.status(503).json({ error: "Service Unavailable" });
});

//#REGION ROUTES
app.use(titleRoutes);
//#ENDREGION

// const Categories = mongoose.model("Categories", {
//   name: String,
// });

//#REGION CATEGORYSEEDER
// const categorySeeder = async () => {
//   await Categories.deleteMany();
//   let listOfCategories = [];
//   let cleanList = [];

//   await netflixData.map((category) => {
//     if (
//       !listOfCategories.includes(
//         category.listed_in.split(",").map((category) => category.trim())
//       )
//     ) {
//       listOfCategories.push(
//         category.listed_in.split(",").map((category) => category.trim())
//       );
//     }
//   });

//   for (let box of listOfCategories) {
//     for (let cate of box) {
//       if (!cleanList.includes(cate)) {
//         cleanList.push(cate);
//       }
//     }
//   }

//   cleanList.map((cat) => new Categories({ name: cat }).save());
// };

//#ENDREGION

const seeder = async () => {
  await TitleModel.deleteMany({});

  await netflixData.map((title) => new TitleModel(title).save());
};

//Seed DB
// seeder();

//404 page
app.use((req, res) => {
  res.send(`<div><h1>Oops, this page doesn't exist 👻</h1>`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
