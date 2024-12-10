import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import booksData from "./data/books.json";
import dotenv from "dotenv"

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Books = mongoose.model("Books", {
  //bookID: { type: Number, required: true },
  title: { type: String, required: true },
  authors: { type: String, required: true },
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    try {
      await Books.deleteMany({});
      console.log("Database cleared");
      const savePromises = booksData.map(book => new Books(book).save());
      await Promise.all(savePromises);
      console.log("Database seeded with initial data");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  };
  seedDatabase();
}

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  try {
    const endpoints = expressListEndpoints(app);
    res.json(endpoints);
  } catch (error) {
    console.error("Error", error);
    res.status(500).send("This page is unavailable at the moment. Please try again later.");
  }
});

// GET all books
app.get("/books", async (req, res) => {
  try {
    const books = await Books.find();
    res.json(books);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

// GET book by id
app.get("/books/:bookId", async (req, res) => {
  const { bookId } = req.params; 
  try {
    const book = await Books.findById( bookId ).exec();
    if (book) {
      res.json(book);
    } else {
      res.status(404).send("No book found with the provided ID");
    }
  } catch (error) {
    console.error(`Error fetching book with ID ${bookId}:`, error);
    res.status(400).json({ error: "Invalid book ID" });
  }
});

//GET book by author
app.get("/authors/:author", async(req, res) => {
  const { author } = req.params;
  try{
    const books = await Books.find({ authors: author });
    if (books && books.length>0 ){
      res.json(books);
    } else {
      res.status(404).json({message:"No books found for this author."});
    }
  } catch (error) {
    res.status(500).json({message:"Server error.", error: error.message});
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});