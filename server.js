import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
import netflixData from "./data/netflix-titles.json";
console.log(netflixData.length);
// import topMusicData from './data/top-music.json'

//const mongoUrl = "mongodb+srv://dbUser:dbUserOlofTechnigo@cluster0.x2ofn.mongodb.net/projectMongo?retryWrites=true&w=majority"
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
console.log(mongoUrl);
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Show = mongoose.model("Show", {
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String,
});

// Show.deleteMany().then(() => {
// netflixData.forEach((showData) => {
//   new Show(showData).save()
// })})

if (process.env.RESET_DB) {
  console.log("resetting database");
  const seedDatabase = async () => {
    await Show.deleteMany({});

    netflixData.forEach((showData) => {
      new Show(showData).save();
    });
  };

  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  console.log("Test");
  res.send("Hello world");
  console.log(mongoUrl);
});

//All shows

app.get("/shows", async (req, res) => {
  const shows = await Show.find();
  res.json(shows);
});

//shows limited to 10 documents, paginated with query "page"

app.get("/shows/limited", async (req, res) => {
  const page = req.query.page;
  const shows = await Show.find()
    .skip((page === 0 ? page : 1) * 10 - 10) //page value 0 will resort to 1 since monbgoDB doesn't accept otherwise.
    .limit(10);
  res.json(shows);
});

//parameter country

app.get("/shows/:country", async (req, res) => {
  const { country } = req.params;
  const shows = await Show.find({ country: country });
  res.json(shows);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
