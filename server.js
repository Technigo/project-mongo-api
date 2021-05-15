import express from "express";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";

import booksData from "./data/books.json";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const bookSchema = new mongoose.Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

const Book = mongoose.model("Book", bookSchema);

// RESET_DB=true npm run dev
if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Book.deleteMany();

    booksData.forEach(async (item) => {
      const newBook = new Book({
        ...item,
      });
      await newBook.save();
    });
  };
  seedDB();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/books", async (req, res) => {
  const { author, title } = req.query;
  const authorRegex = new RegExp(author, "i");
  const titleRegex = new RegExp(title, "i");

  try {
    const books = await Book.find({
      authors: authorRegex,
      title: titleRegex,
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong", details: error });
  }
});

app.get("/books/book/:bookID", async (req, res) => {
  const { bookID } = req.params;

  try {
    const singleBook = await Book.findById(bookID);
    if (singleBook) {
      res.status(200).json(singleBook);
    } else {
      res.status(404).json({ error: "No books with this ID" });
    }
  } catch (error) {
    res.status(400).json({ error: "Something went wrong", details: error });
  }
});

app.get("/books/isbn/:ISBN", async (req, res) => {
  const { ISBN } = req.params;

  try {
    const singleBook = await Book.findOne(ISBN);
    if (singleBook) {
      res.status(200).json(singleBook);
    } else {
      res.status(404).json({ error: "No books with this ISBN number" });
    }
  } catch (error) {
    res.status(400).json({ error: "Something went wrong", details: error });
  }
});

app.get("/books/topten", async (req, res) => {
  try {
    const Books = await Book.find().sort({ average_rating: -1 }).limit(10);
    res.status(200).json(Books);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong", details: error });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
