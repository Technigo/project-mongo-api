import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
import netflixData from "./data/netflix-titles.json";
//import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Title = mongoose.model("Title", {
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

if(process.env.RESET_DB) {
const seedDatabase = async () => {
  await Title.deleteMany()
  const snowwhite = new Title({ title: "Snow White" })
  await snowwhite.save()
  const lionking = new Title({ title: "Lion King" })
  await lionking.save()
}

seedDatabase()


 /* const resetDataBase = async () => {
    await Title.deleteMany();
    netflixData.forEach(singleTitle => {
      const NewTitle = new Title(singleTitle);
      NewTitle.save()
    })
  }
  resetDataBase(); */
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
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/titles", async (req, res) => {
 const titles = await Title.find()
 res.json(titles)
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
