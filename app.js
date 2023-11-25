import cors from "cors";
import express from "express";

const listEndpoints = require("express-list-endpoints");

const filmsRouter = require("./routes/filmsRoutes");

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

app.use("/api/v1/", filmsRouter);

app.use("/", (req, res) => {
  res.json(listEndpoints(app));
});

app.all("*", (req, res, next) => {
  res.status(501).json({ status: "fail", message: "Not Implemented Endpoint 💥 " });
  next();
});

module.exports = app;
