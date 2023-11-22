import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import booksData from "./data/books.json";
import { BookModel } from "./models/Book";
import bookRoutes from "./routes/bookRoutes";

// Seeding the database
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await BookModel.deleteMany({})

    booksData.forEach((bookData) => {
      new BookModel(bookData).save();
    });
  }

  seedDatabase();
}

// Connect to the database through Mongoose for local development
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"; // Get the MongoDB connection URL from environment variable
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to the MongoDB database
mongoose.Promise = Promise; // Set Mongoose to use ES6 Promises

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. PORT is not stored in .env file, rather something copied from Express server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to the book routes here
app.use(bookRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
