import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import goldenGlobesData from "./data/golden-globes.json"
import { ObjectId } from "mongoose";

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
      await Nomination.deleteMany(); // waiting to delete all data before we create a new object
    const addedNominate = new Nomination({
      year_film: 2044, 
      year_award: 2045,
      ceremony: 165,
      category: "best tragic comedy",
      nominee: "smurf",
      win: false
      
    }); 
    
    const addedNominate2 = new Nomination({
      _id: ObjectId,
      year_film: 2023, 
      year_award: 2015,
      ceremony: 65,
      category: "best actor",
      nominee: "Johny Deep",
      win: true
    
    });
    addedNominate.save();// we need to put it in the reset function because if is after the deleteMany happens before and we do not update the DB
    addedNominate2.save()
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
  res.send("Hello Traveler!, Available endpoints: /nominees, nominees/category/:category");
});

app.get("/nominees", async (req, res) => {
 const nominees =  await Nomination.find()
  res.json(nominees);
});

app.get("/nominees/category/:category", async (req, res) => {
  try{
    const category =  await Nomination.find({category: req.params.category}) // finding a requested category, it is possible to add RegEXP as well inside "find" to make it possible to write only one word.
                                                                             // example: await Nomination.find({category: new RegExp(req.params.category)})
    if(category) {
      res.status(200).json({
        success: true,
        status_code: 200,
        data: category
      })
    }
    else {
      res.status(404).json({
        success: false,
        status_code: 404, 
        data: "There is not data with this category. Try: <br> best actor <br> best tragic comedy "
      })
    }
  }
     catch (err) {
      res.status(400).json({
        success: false,
        status_code: 400,
        error: "Invalid category!! Try: `best actor`, `best tragic comedy`"
      })
     }   

 });

// app.get("/nominees/nominee name/:nominee", async (req, res) => {
//   const nominees = await Nomination.find(req.params.nominee)
//   res.json(nominees)
//   console.log(nominees)
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

