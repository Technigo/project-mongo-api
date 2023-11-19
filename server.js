import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  mongoose.connection.readyState !== 1
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

const seeder = async () => {
  await Title.deleteMany();
  netflixData.map((title) =>
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
Title.deleteMany();
console.log(mongoUrl);

//Seed DB
// Title.deleteMany().then(() => {
//   seeder();
// });

seeder();
// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
