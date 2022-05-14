import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

import laureatesData from "./data/laureates.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8081;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Req: Your API should make use of Mongoose models to model your data and use these models to fetch data from the database.
// Modelling the database:
const Laureate = mongoose.model("Laureate", {
  id: Number,
  name: String,
  year: Number,
  category: String,
  country: String,
  description: String,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    // deleti all items in the database to prevent to copy over the items
    await Laureate.deleteMany({});

    laureatesData.forEach((item) => {
      const newLaureate = new Laureate(item);
      newLaureate.save();
    });
  };
  seedDatabase();
}
// Endpoints
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

// Req: A minimum of one endpoint to return a collection of results (array of elements)
app.get("/laureates", async (req, res) => {
  const list = await Laureate.find();
  res.json(list);
});

app.get("/shows/movies", async (req, res) => {
  const showMovies = await Movie.find({ type: "Movie" });
  res.json(showMovies);
});

app.get("/shows/tvshows", async (req, res) => {
  const showTvshows = await Movie.find({ type: "TV Show" });
  res.json(showTvshows);
});

// Req: A minimum of one endpoint to return a single result (single element).

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
