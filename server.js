import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require(('express-list-endpoints'))

const NetflixTitles = mongoose.model('NetflixTitles', {
  title: String,
  show_id: Number,
  director: String,
  cast: String,
  country: String,
  release_year: Number,
  listed_in: String,
  type: String

});

  if (process.env.RESET_DB) {
    const seedDatabase = async () => {
      await NetflixTitles.deleteMany({})

      netflixData.forEach((movieData) => {
      new NetflixTitles(movieData).save();
      })
    
    }
    seedDatabase()
  }


// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  const welcomeText = ("Welcome to my Mongo API Page. Try the list below or search for titles in the url, using the netflix-titles/?title=...")
  const endpoints = (listEndpoints(app))
  res.send({ body: welcomeText, endpoints})
});

//Shows a list of all titles and makes it possible to search for the 
//movie or show by name in the url. It also works to search for parts 
//of the name.

app.get("/netflix-titles", async (req, res) => {
  const { title } = req.query
    const response = {
    success:true,
    body:{}
  }
  
  const titleRegex = new RegExp(title);
  //The 'i' makes the query case insensitive 
    try{
      const searchResultFromDB = await NetflixTitles.find({
        title: { '$regex': titleRegex, $options: 'i' }});
        if (searchResultFromDB) {
          response.body = searchResultFromDB,
          res.status(200).json(response)
        } else {
          response.success = false,
          res.status(404).json(response)
        }
      } catch (e){
        response.success= false,
        res.status(500).json(response)
        }
        });

//shows only tv-shows
app.get('/tv-shows', async (req, res) => {
  const tvShows = await NetflixTitles.find({ type: 'TV Show' });
  res.json(tvShows);
});

//shows only movies
app.get('/movies', async (req, res) => {
  const allMovies = await NetflixTitles.find({ type: 'Movie' });
  res.json(allMovies);
});

//shows a single title by id
app.get('/netflix-titles/:id', async (req, res) => {
  try{
  const showID = await NetflixTitles.findById(req.params.id)
  
  if (showID) {
    res.status(200).json({
      success: true,
      message: 'OK',
      body: {
        showID
      }
    })
  } else {
      res.status(404).send({
      success: false ,
      body: {
        message: "(404) ID not found",

      }
      }
     )}

} catch(error){
     res.status(400).json({
       success: false,
       body: {
         message: "bad request"
      }
})
}})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
