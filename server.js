import express from "express";
import cors from "cors";
import mongoose, { Schema } from "mongoose";
import expressListEndpoints from 'express-list-endpoints';
import dotenv from "dotenv"

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import topMusicData from "./data/top-music.json";

import netflixData from "./data/netflix-titles.json";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// set up schema
const netflixSchema = new Schema({
    "title": String,
    "director": String,
    "cast": String,
    "country": String,
    "date_added": String,
    "release_year": Number,
    "rating": String,
    "duration": String,
    "listed_in": String,
    "description":String,
    "type": String
})

//set model
const Netflix = mongoose.model('Netflix', netflixSchema)

// seed the database. seeding can be removed when it's done
if(process.env.RESET_DATABASE){
  const seedDatabase = async () => {

  await Netflix.deleteMany()
  netflixData.forEach(netflix => {
    new Netflix(netflix).save()
  })
}
seedDatabase()
}



// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 9090;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints)
});

//sort data by ascending years and each page shows 8 data
app.get("/netflix", async (req, res) => {
  const allNetflix = await Netflix.find().sort({release_year:1}).limit(8)

  if(allNetflix.length > 0) {
    res.json(allNetflix)
  }else {
    res.status(404).send('no dramas/movies was found.')
  }
})

app.get("/netflix/:id", async(req, res) => {
  const netflixById = await Netflix.findById(req.params.id)
  if(netflixById){
    res.json(netflixById)
  }else {
    res.status(404).send('no dramas/movies was found.')
  }
})

app.get("/movies", async(req, res) => {
  const movieType = await Netflix.find({type: "Movie"})

  if(movieType){
    res.json(movieType)
  }else{
    res.status(500).send('Internet server Error.')
  }
})


app.get("/shows", async(req, res) => {
  const showsType = await Netflix.find({type: "TV Show"})

  if(showsType){
   res.json(showsType) 
  }else{
    res.status(419).send('This page is expired')
  }
  
})

//regex: regular expression
//search by country
app.get("/country", async(req, res) => {
  const countryName = req.query.country

  const regex = new RegExp (countryName, 'i')

  const countryResult = await Netflix.find({country: regex})

  if(countryResult){
    res.json(countryResult)
  }else{
    res.status(404).send('no dramas/movies was found.')
  }
})

//search by title
app.get("/title", async(req, res) => {
  const titleName = req.query.title

  const regex = new RegExp (titleName, 'i')

  const titleResult = await Netflix.find({title: regex})

  if(titleResult){
    res.json(titleResult)
  }else{
    res.status(404).send('no dramas/movies was found.')
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});