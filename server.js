import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();// Load environment variables from the .env file
import netflixTitleRoutes from "./routes/netflixTitleRoutes";
import { NetflixTitleModel, ActorModel, CountryModel } from "./models/NetflixTitle";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL // Get the MongoDB connection URL from environment variables
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });// Connect to the MongoDB database
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors
app.use(cors());// Enable CORS (Cross-Origin Resource Sharing)
app.use(express.json());// Parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data

//-------Creating the database from scratch--------------

const feedDatabase = async () =>{

  await NetflixTitleModel.deleteMany();
  await ActorModel.deleteMany();
  await CountryModel.deleteMany();

  netflixData.forEach((title)=>{
    new CountryModel({name: title.country}).save();
    const castList= title.cast.split(",")
    castList.forEach((actor)=>{new ActorModel({name:actor.trim()}).save()})
    new NetflixTitleModel(title).save();
  })
}

if (process.env.RESET_DATABASE == 'true'){
  feedDatabase();
}
// Using the routes to handle API requests
app.use(netflixTitleRoutes);

const listEndpoints = require('express-list-endpoints')
//---- Documentation of API ----
app.get("/", (req, res) => {
    const endpoints = listEndpoints(app);
    res.json(endpoints)
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
