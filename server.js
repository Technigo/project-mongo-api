import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { Book } from "./models/BookModel";
import listEndpoints from "express-list-endpoints";

// Define the port
const port = process.env.PORT || 8000;
const app = express();

// Add middlewares to enable CORS and JSON body parsing
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Check if connection to the database is stable
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// Define routes

// Root route listing all endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.status(200).json(endpoints);
});

// Route for saving a new book
app.post("/books", async (req, res) => {
  try {
    // Check if the new data has the required properties
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).json({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    // Add a new book to the database
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
      language: req.body.language,
      average_rating: req.body.average_rating,
      num_pages: req.body.num_pages,
      ratings_count: req.body.ratings_count,
    };

    // Create a new instance
    const book = await Book.create(newBook);
    // Send the new book to the client
    return res.status(201).json(book);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route for getting all books from the database
app.get("/books", async (req, res) => {
  try {
    const { author, language, publishYear, average_rating, num_pages } = req.query;
    let query = {};

    if (author) {
      query.author = author;
    }

    if (language) {
      query.language = language;
    }

    if (publishYear) {
      query.publishYear = publishYear;
    }

    if (average_rating) {
      query.average_rating = { $gte: average_rating }; // Find books with rating equal or greater than specified
    }

    if (num_pages) {
      query.num_pages = { $gte: num_pages }; // Find books with number of pages equal or greater than specified
    }

    console.log("Query:", query); // Log the query for debugging

    const books = await Book.find(query);

    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route for getting one book from the database using ID
app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    return res.status(200).json(book);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route for updating a book
app.put("/books/:id", async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).json({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    const { id } = req.params;
    const result = await Book.findByIdAndUpdate(id, req.body);

    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ message: "Book updated successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route for deleting a book
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ message: "Book successfully deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/bookStore";
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("App is connected to the database");
    // Start the server when connected to the database
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.Promise = Promise;
