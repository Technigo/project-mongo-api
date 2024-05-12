import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";

//This will connect us to the Data Base
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//Here we create a Book modell
const Book = mongoose.model("Book", {
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

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=8080 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
  // res.send("<b>This is my first API Database using MongoDB!");
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findOne({ bookID: id });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/// example: books/search?title=Harry%20Potter&author=J.K.%20Rowling
/// example: books/search?title=Harry%20Potter
/// example: books/search?author=J.K.%20Rowling
app.get("/books/search", async (req, res) => {
  const { title, author } = req.query;
  try {
    let query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (author) {
      query.authors = { $regex: author, $options: "i" };
    }
    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//example: /books/language/eng
app.get("/books/language/:language_code", async (req, res) => {
  const { language_code } = req.params;
  try {
    const books = await Book.find({ language_code });
    if (books.length > 0) {
      res.json(books);
    } else {
      res
        .status(404)
        .json({ error: "No books found for the specified language code" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//example /books/rating?min_rating=3.5&max_rating=4.5
app.get("/books/rating", async (req, res) => {
  const { min_rating = 0, max_rating = 5 } = req.query;
  try {
    const books = await Book.find({
      average_rating: {
        $gte: parseFloat(min_rating),
        $lte: parseFloat(max_rating),
      },
    });
    if (books.length > 0) {
      res.json(books);
    } else {
      res
        .status(404)
        .json({ error: "No books found within the specified rating range" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//any other endpoints with GET method that are not acceptable -> 404 error
app.use((req, res, next) => {
  const err = new Error(`Cannot find endpoint: ${req.originalUrl}.`);
  err.statusCode = 404;
  next(err);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
