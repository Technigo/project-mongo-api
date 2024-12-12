import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import expressListEndpoints from "express-list-endpoints";
import booksData from "./data/books.json";
import Book from "./models/BookSchema";

// Configure dotenv
dotenv.config();

// Set up mongoUrl and localhost
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/bookshop";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Seed database
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    console.log("Resetting and seeding");
    await Book.deleteMany();

    booksData.forEach((book) => {
      new Book(book).save();
    });
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Middleware to check database status
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// ----- ROUTES -----

// GET API documentation
app.get("/", (req, res) => {
  try {
    const endpoints = expressListEndpoints(app);
    res.json(endpoints);
  } catch (error) {
    console.error("Error", error);
    res
      .status(500)
      .send("This page is unavaliable at the moment. Please try again later.");
  }
});

// GET books
app.get("/books", async (req, res) => {
  const { sort, order } = req.query;

  const allBooks = Book.find();

  // Check if there are any books
  if (allBooks.length === 0) {
    res.status(404).send("No books were found");
    // Check if we should sort by rating
  } else if (sort === "rating") {
    // Determine sort order
    const sortOrder = order === "ascending" ? 1 : -1;
    const sortedBooks = allBooks.sort({ average_rating: sortOrder });
    res.json(await sortedBooks);
  } else {
    res.json(await allBooks);
  }
});

// GET book by id
app.get("/books/:bookId", async (req, res) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId).exec();

  if (book) {
    res.json(book);
  } else {
    res.status(404).send("No book was found");
  }
});

// GET book by ISBN
app.get("/isbn/:isbn", async (req, res) => {
  const { isbn } = req.params;

  const query = Book.where({ isbn: isbn });
  const book = await query.findOne();

  if (book) {
    res.json(book);
  } else {
    res.status(404).send("No book was found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
