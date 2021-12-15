import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/bookTest";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

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
if (process.env.CLEAR_DB) {
  console.log("Seeding the db with all the files");
  const seedDB = async () => {
    await Book.deleteMany({});
    booksData.forEach((oneBook) => {
      new Book(oneBook).save();
    });
  };

  seedDB();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello this is the API: go to endpoint /books to start");
});

app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.get("books/:id", async (req, res) => {
  const book = await Book.findOne({ bookID: req.params.id });
  if (book) {
    res.json(book);
  } else {
    res.status(404).res({ error: "A book with such a ID does not exist" });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
