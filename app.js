import cors from "cors";
import express from "express";

// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });

const listEndpoints = require("express-list-endpoints");

const app = express();

app.use(cors());
app.use(express.json());

// import data from "./data/netflix-titles.json";
// import Film from "./models/filmsModel";
// console.log(process.env.RESET_DB);
// if (process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     data.forEach((film) => {
//       new Film(film).save();
//     });

//     console.log("dataset");
//   };
//   seedDatabase();
// }

const filmsRouter = require("./routes/filmsRoutes");

app.use("/api/v1/", filmsRouter);

app.use("/", (req, res) => {
  res.json(listEndpoints(app));
});

app.all("*", (req, res, next) => {
  res.status(400).json({ status: "fail", message: "Something went very wrong 💥 " });
  next();
});

module.exports = app;
