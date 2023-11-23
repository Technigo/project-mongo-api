import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config() // Load environment variables from the .env file
import { BookModel } from "./models/Book";
import bookRoutes from "./routes/bookRoutes"

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

//Connection to the database through Mongoose (for local development)
const mongoUrl = process.env.MONGO_URL //Get the MongoDB connection URL from env variable
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080 //Set the port number for the server
const app = express() //Create an instance of the express application

// Add middlewares to enable cors and json body parsing
app.use(cors()); //Enable CORS (Cross-Origin Resource sharing)
app.use(express.json()); //Parse incoming JSON data
app.use(express.urlencoded({ extended: false})) //Cool method according to Diego

//Seeding the database
//RESET_DB=true npm run dev
if (process.env.RESET_DB) {
  console.log("Resetting database!")

  const seedDatabase = async () => {
    await BookModel.deleteMany({})
    booksData.forEach((book) => {
      new BookModel(book).save()
    })
  }
  seedDatabase()
}

//Getting hold of the get/post-methods (routes) through the bookRoutes
app.use(bookRoutes)

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
