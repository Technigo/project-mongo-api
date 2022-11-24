import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import goldenGlobesData from "./data/golden-globes.json"

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Nomination = mongoose.model("Nomination", {
  "year_film": Number,
    "year_award": Number,
    "ceremony": Number,
    "category": String,
    "nominee": String,
    "win": Boolean

}); 

// reseting database is to educational purposes, to not have duplicates
// in production we should not use it without special order from menagers
if (process.env.RESET_DB) {
  const resetDataBase = async () => {
  //  await addedNominate.deleteMany(); // waiting to delete all data before we create a new object
    const addedNominate = new Nomination({
      year_film: 2044, 
      year_award: 2045,
      ceremony: 165,
      category: "best tragic comedy",
      nominee: "smurf",
      win: false
      
    
    });
    addedNominate.save() // we need to put it in the reset function because if is after the deleteMany happens before and we do not update the DB

  }
  resetDataBase();
}








// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8090;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
