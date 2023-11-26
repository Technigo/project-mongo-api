import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"; // Import dotenv for environment variables
dotenv.config(); // Load environment variables from the .env file
import movieRoutes from "./routes/movieRoutes"; //Import Routes
import listEndpoints from "express-list-endpoints";
import movieData from "./data/netflix-titles.json";
import { MovieModel } from "./models/Movie";

// Connection to the database through Mongoose (for local development)
const mongoUrl = process.env.MONGO_URL; // Get the MongoDB connection URL from environment variables
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to the MongoDB database
mongoose.Promise = Promise; // Set Mongoose to use ES6 Promises

// Defines the port the app will run on. Defaults to 8080, but can be overridden
const port = process.env.PORT || 8080; //Set the port number of the server
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors()); // Enable CORS (Cross-Origin Resource Sharing)
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data to a json

//Seeding the database 
const seedDatabase = async () => {
  await MovieModel.deleteMany({})
  movieData.forEach((book) => {
    new MovieModel(book).save()
  })
}
seedDatabase()


// Use the routes for handling the API REquests!
//Route to list all the endpoints
app.get('/', (req, res) => {
  res.json({ endpoints: listEndpoints(app) });
});
app.use(movieRoutes);

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`); // Display a message when the server is successfully started
});


