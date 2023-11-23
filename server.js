import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define our book model
const Book = mongoose.model('Book', {
  title: String,
  authors: String,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({});

    booksData.forEach(async (bookData) => {
      await new Book({
        title: bookData.title,
        authors: bookData.authors,
      }).save();
    })
  }

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

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

app.get("/books", async (req, res) => {
  const title = req.query.title;
  const authors = req.query.authors;

  const query = {};

  if (title) {
    query.title = { "$regex": title, "$options": "i" };
  }

  if (authors) {
    query.authors = { "$regex": authors, "$options": "i" };
  }

  const books = await Book.find(query);
  res.json(books);
});

app.get("/books/:bookId", async (req, res) => {
  const bookId = req.params.bookId;
  const book = await Book.findById(bookId);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
