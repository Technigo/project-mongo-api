import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
import netflixData from "./data/netflix-titles.json"
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const { Schema } = mongoose;

const netflixTitleSchema = new Schema({
  id: Number,
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
  type: String
});

const NetflixTitle = mongoose.model('NetflixTitle', netflixTitleSchema);

if (process.env.RESET_DB) { 
  const resetDatabase = async () => {
    await NetflixTitle.deleteMany();
    netflixData.forEach = ((singleData) => {
      const newTitle = new NetflixTitle(singleData);
      newTitle.save()
    })
  }
 resetDatabase();
}
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (request, response) => {
  response.send("Hello Bananas!");
});

// https://localhost:8080/netflix-titles
// This gets a list of all titles 
app.get('/netflix-titles', async (request, response) => {
  const netflixTitles = await NetflixTitle.find();
  response.json(netflixTitles);
});

// https://localhost:8080/netflix.titles/
// This gets a single title when adding its id-number after the last formard slash
app.get('/netflix-titles/:id', async (request, response) => {
  const netflixTitle = await NetflixTitle.findOne({ id: request.params.id });
  response.json(netflixTitle);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
