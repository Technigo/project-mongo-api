import express from "express";
import cors from "cors";
const listEndpoints = require("express-list-endpoints");

const app = express();

app.use(cors());
app.use(express.json());

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
