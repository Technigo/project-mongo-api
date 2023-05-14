import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
import booksData from "./data/books.json";

// Had to change localhost to 127.0.0.1:27017 to stop constant crashing.
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Schema - blueprint for the data structure
const { Schema } = mongoose;
const bookSchema = new Schema ({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

// Model -  creates based on the schema
const Book = mongoose.model("Book", bookSchema)

// Reset the database - This function in here, will only run on reset
// resetDatabase deletes everything from database, and then uses the forEact
// loop to add every object from books.json to database.
// this method is the same as adding json to compass.
if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Book.deleteMany();
    booksData.forEach((singleBook) => {
      const newBook = new Book (singleBook)
      newBook.save()
    })
  }
  resetDatabase()
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app))
});

//Route to all books
app.get("/books", async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

// Route to a single book
// Note that id here refers to the object-id, which can be found in compass
app.get("/books/id/:id", async (req, res) => {
  try {
    const singleBook = await Book.findById(req.params.id)
    if (singleBook) {
      res.status(200).json({
        success: true,
        body: singleBook
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Book not found"
        }
      })
    }
  } catch(e) {
    res.status(404).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
