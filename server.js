import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/projectmoviesmongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');
const  swaggerJsdoc = require("./swagger.json");
const swaggerUi = require("swagger-ui-express");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc)
);
// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Movie = mongoose.model('Movie', {
  title: String,
  director:String,
  cast:String,
  country:String,
  date_added:String,
  release_year:Number,
  rating:String,
  duration:String,
  listed_in:String,
  description:String,
  type:String,
})

if (process.env.RESET_DB) {
	const seedDatabase = async () => {
    await Movie.deleteMany({})
		netflixData.forEach((movie) => {
			new Movie(movie).save()
		})
  }

  seedDatabase()
}

// Routes
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

app.get('/movies', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10 // default limit is 10
  const page = parseInt(req.query.page) || 1 // default page is 1
  const skip = (page - 1) * limit // calculate the number of objects to skip
  const totalLengthofData=await Movie.find().countDocuments()
try{
  const movies = await Movie.aggregate([
    { $sort: { release_year: -1 } },
    { $skip: skip },
    { $limit: limit }
  ])
  if(movies){
     res.status(200).json({
      success: true,
      message: "OK",
      body: {
        data: movies,
        totalPages: Math.ceil(totalLengthofData / limit)
      }
    })
  }else{
  res.status(404).json({ error: 'No movies found' })
  }
}catch{
      console.log(err)
    res.status(400).json({ error: 'Invalid type' })
}

})

app.get('/movies/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id)
  res.json(movie)
})

app.get('/movies/type/:type', async (req, res) => {
  try{
  const moviesType = await Movie.find({type: req.params.type})
  if(moviesType.length>0){
      res.json(moviesType)
  }
  else {
    res.status(404).json({ error: 'No movies found with this type' })
  }
  }
  catch(err){
    console.log(err)
    res.status(400).json({ error: 'Invalid type' })
  }

})

app.get('/movies/type/:type/:release_year', async (req, res) => {
  try{
  const moviesType = await Movie.find({type: req.params.type}).where('release_year', Number(req.params.release_year))
  if(moviesType.length>0){
  res.json(moviesType)
  }
  else {
    res.status(404).json({ error: 'No movies found with this release date' })
  }
  }
  catch(err){
    console.log(err)
    res.status(400).json({ error: 'Invalid parameter' })
  }

})

app.get('/movies/title/:title', async (req, res) => {
  try{
  const movies = await Movie.aggregate(
   [
      { $match: {
         $or: [
        { title: { $regex: req.params.title, $options: 'i' } },
      ]
      }},
      { $sort: { release_year: -1 } },
   ]
)
  console.log(req.params.title)
  if(movies.length>0){
      res.json(movies)
  }
  else {
    res.status(404).json({ error: 'No movies found with this title' })
  }
  }
  catch(err){
    console.log(err)
    res.status(400).json({ error: 'Invalid title' })
  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
