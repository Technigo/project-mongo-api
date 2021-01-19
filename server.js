import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from 'express-list-endpoints';

import booksData from "./data/books.json";

//Author model and connection to database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-books";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

//A model
const Book = mongoose.model("Book", {
  title: String,
  authors: String,
  isbn: Number,
});

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Book.deleteMany();

    booksData.forEach((item) => {
      const newBook = new Book(item);
      newBook.save();
    });
  };
  seedDatabase();
};

// Routes starts here
app.get("/", (req, res) => {
  // res.send("Welcome, this is the database full of great books");
  res.send(listEndpoints(app));
});

//Get all books
app.get("/books", async (req, res) => {
  const allBooks = await Book.find();

  if (allBooks.length > 0) {
    res.json(allBooks);
  } else {
    res.status(404).json({ error: "Sorry, could not find the data" });
  }
});

//Get a single title for a book
app.get("/books/title/:title", async (req, res) => {
  const singleTitle = await Book.findOne({ title: req.params.title });

  if (singleTitle) {
    res.json(singleTitle);
  } else {
    res.status(404).json({ error: "Sorry, could not find the title" });
  }
});

// leaving this console.log here for future referense
// console.log(listEndpoints(app));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
