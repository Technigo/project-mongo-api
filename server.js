import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import bodyParser from "body-parser";

import booksData from "./data/books.json" assert { type: "json" };

dotenv.config();

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

mongoose.set("strictQuery", false);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const BookDataModel = mongoose.model("BookData", {
  bookID: { type: Number },
  title: { type: String },
  authors: { type: String },
  average_rating: { type: Number },
  isbn: { type: Number },
  isbn13: { type: Number },
  language_code: { type: String },
  num_pages: { type: Number },
  ratings_count: { type: Number },
  text_reviews_count: { type: Number },
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    console.log("Resetting database!");

    await BookDataModel.deleteMany({});

    booksData.forEach(async (book) => {
      await new BookDataModel(book).save();
    });
  };
  seedDatabase();
}

app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

app.get("/books", async (req, res) => {
  try {
    const books = await BookDataModel.find();
    res.json(booksData);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Data not found" });
  }
});

app.get("/books/:bookID", async (req, res) => {
  const { bookID } = req.params;

  try {
    const book = await BookDataModel.findOne({ bookID: +bookID });

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/books/author", async (req, res) => {
  const authorName = req.query.author;
  if (!authorName) {
    return res.status(400).json({ error: "Author name is required" });
  }

  try {
    const booksByAuthor = await BookDataModel.find({ authors: authorName });
    res.json(booksByAuthor);
  } catch (err) {
    res.status(400).json({ error: "Error fetching author's books" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
