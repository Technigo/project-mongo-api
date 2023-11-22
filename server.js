import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import data from "./data/books.json" assert { type: "json" };
import dotenv from "dotenv";
dotenv.config();

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongo-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const bookSchema = new mongoose.Schema({
  // Properties defined here match the keys from the books.json file
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

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({});

    data.forEach((data) => {
      new Book(data).save();
    });
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
  res.json(listEndpoints(app));
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    if (books) {
      res.json(data);
    } else {
      res.status(404).json({ error: "Can't find any book" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid book id" });
  }
});

app.get("/books/:bookID", async (req, res) => {
  try {
    const bookID = parseInt(req.params.bookID, 10);
    const book = await Book.findOne({ bookID: bookID });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid book id" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
