import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const filmsRouter = require("./routes/filmsRoutes");

app.use("/", filmsRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({ status: "fail", message: "Something went wrong 💥 " });
  next();
});

module.exports = app;
