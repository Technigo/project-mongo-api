import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";
import cats from "./data/cats.json"


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const Cat= mongoose.model ("Cat", {
id: Number, 
breed: String, 
fur_length: String, 
fur_color: String, 
personality: String, 
eye_color: String,
commonality: String
})


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 9000;
const app = express();

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Cat.deleteMany({})  //Deletes all documents in the 'Cat' collection
    data.forEach (cat => {  // Iterates over the 'data' array
      newCat (cat).save() // Creates a new Cat document for each item in 'data' and saves it
    })
  }
  seedDatabase()
  }

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());



// Documentation Route
app.get("/", (request, response) => {
  const endpoints = listEndpoints(app) // Fetch all available routes
  response.json({
    message: "Miao Miao! Welcome to the Cats Mongo API!  Here you can find all types of cats. Below are the available endpoints",
    endpoints: endpoints // Send the list of endpoints as JSON
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
