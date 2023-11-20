import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import booksData from "./data/books.json";

dotenv.config();

mongoose.set("strictQuery", false);
const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service Unavailable" });
  }
});
// Import Schema and Define the schema

const Book = mongoose.model("Book", {
  bookID: Number,
  title: String,
  author: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});
// RESET Database
if (process.env.RESET_DB) {
  console.log("Resetting database!");

  const seedDatabase = async () => {
    await Book.deleteMany();

    booksData.forEach((book) => {
      new Book(book).save();
    });
  };

  seedDatabase();
}

// Route to get a list of all registered endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json(endpoints);
});

// /books?page=1&pageSize=10: Get the first page with 10 items per page.
// /books?page=2&pageSize=20: Get the second page with 20 items per page.
app.get("/books", async (req, res) => {
  try {
    // Parse query parameters for pagination
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page if not specified

    // Calculate the number of items to skip based on the page and pageSize
    const pipeline = [
      {
        $sort: { average_rating: -1 },
      },
      {
        $skip: (page - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ];

    // Sort the book's average_rating from highest to lowest, -1 represents descending order.
    const books = await Book.aggregate(pipeline);

    res.status(200).json({
      success: true,
      message: "OK ✅",
      body: { books },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const bookID = Number(req.params.id);
    const book = await Book.findOne({ bookID });
    if (book) {
      res.status(200).json({
        success: true,
        message: "OK✅",
        body: { book },
      });
    } else {
      res.status(404).json({ error: "Book cannot be found!❌" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
});
// The url should provide the `maxPages` /books/pages/num?maxPages=50
app.get("/books/pages/num", async (req, res) => {
  try {
    const { maxPages } = req.query;
    const filter = maxPages ? { num_pages: { $lt: maxPages } } : {};

    const books = await Book.find(filter);
    res.status(200).json({
      success: true,
      message: "OK✅",
      body: { books },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
