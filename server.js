import mongoose from "mongoose";
import booksData from "./data/books.json";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";

dotenv.config();
mongoose.set("strictQuery", false);

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongo-books";
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

const BookModel = mongoose.model("Book", bookSchema); // Renamed to BookModel

const seedDatabase = async () => {
  try {
    await BookModel.deleteMany({});
    await BookModel.insertMany(booksData);
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Define routes

app.get("/", (req, res) => {
  const htmlContent = `
    <p>Hello Technigo! This is the documentation of the API.</p>
    <p>Here you will find <a href="/books">View All Books</a></p>
    <p><a href="/books/123">View Book by ID</a></p>
  `;
  res.send(htmlContent);
});

app.get("/books", async (req, res) => {
  try {
    const allBooks = await BookModel.find();
    res.json(allBooks);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/books/:bookID", async (req, res) => {
  try {
    const { bookID } = req.params;
    const singleBook = await BookModel.findOne({ bookID });
    if (singleBook) {
      res.json(singleBook);
    } else {
      res.status(404).json({ error: "Book not found, try another number" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add more routes as needed

app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json(endpoints);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

/*import mongoose from "mongoose";
import Book from "./models/Book.js";
import booksData from "./data/books.json";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";

dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongo-books";
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


const seedDatabase = async () => {
  try {
    await Book.deleteMany({});
    await Book.insertMany(booksData);
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

Define routes

app.get("/", (req, res) => {
  res.send("Hello Technigo! This is the documentation of the API.");
});

app.get("/books", async (req, res) => {
  try {
    const allBooks = await Book.find();
    res.json(allBooks);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/books/:bookID", async (req, res) => {
  try {
    const { bookID } = req.params;
    const singleBook = await Book.findOne({ bookID });
    if (singleBook) {
      res.json(singleBook);
    } else {
      res.status(404).json({ error: "Book not found, try another number" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

Add more routes as needed

app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json(endpoints);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
*/

/*import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import { body, validationResult } from "express-validator"; // Import express-validator functions

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define your Mongoose schema and model here

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Validation and sanitization middleware for POST /books
app.post(
  "/books",
  [
    body("title").notEmpty().trim().escape(), // Validate title
    body("authors").notEmpty().trim().escape(), // Validate authors
    body("average_rating").isNumeric(), // Validate average_rating
    body("isbn").isNumeric(), // Validate isbn
    body("isbn13").isNumeric(), // Validate isbn13
    body("language_code").notEmpty().trim().escape(), // Validate language_code
    body("num_pages").isNumeric(), // Validate num_pages
    body("ratings_count").isNumeric(), // Validate ratings_count
    body("text_review_count").isNumeric(), // Validate text_review_count
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // If no validation errors, proceed with saving the data to the database
    try {
      // Save data to the database
      const book = new Book(req.body);
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      console.error("Error saving book:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Define your other routes here

app.get("/", (req, res) => {
  const endpoints = listEndpoints(app); // Call listEndpoints function to get all registered routes
  res.json({ endpoints }); // Return the list of endpoints as JSON
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
*/
