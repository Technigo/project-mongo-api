import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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
  kids_friendly: Boolean,
});

// if (process.env.RESET_DB) {
const seedDatabase = async () => {
  await Book.deleteMany({});

  booksData.forEach((item) => {
    const newBook = new Book(item);
    newBook.save();
  });
};

seedDatabase();
// }

//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(
    "Welcome to Books API! 1. Get the list of all books and specify your request with query params: author, title, pagination (page, limit). 2. Get a single book by ID. 3. Get a list of most popular books and specify a language code with query params if needed."
  );
});

//all books data
app.get("/books", async (req, res) => {
  const author = req.query.author?.toLowerCase();
  const title = req.query.title?.toLowerCase();

  const findFilter = {};

  if (author) {
    findFilter.authors = { $regex: new RegExp(author, "i") };
  }

  if (title) {
    findFilter.title = { $regex: new RegExp(title, "i") };
  }

  const allBooks = Book.find(findFilter);

  // We need to access the page and limit set by the client.
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  // Pagination
  const startPage = (page - 1) * limit;
  const endPage = page * limit;
  const totalDocs = await Book.countDocuments(); // this counts all the documents in the collection. Similar to .length
  let pagination = {};
  // adding next and previous pages in the api
  //next page
  if (endPage < totalDocs) {
    pagination.next = {
      next: page + 1,
      limit: limit,
    };
  }
  // previous page
  if (startPage > 0) {
    pagination.previous = {
      previous: page - 1,
      limit: limit,
    };
  }
  const books = await allBooks.skip(startPage).limit(limit);

  if (books.length === 0) {
    res.status(404).send("data not found");
  } else {
    //now we have our paginated results in the blogs variable;
    res.status(200).json({ success: true, count: books.length, pagination, data: books });
  }
});

// books by id
app.get("/books/:id", async (req, res) => {
  const book = parseInt(req.params.id, 10);
  const allBooks = await Book.findOne({ bookID: book });

  if (!allBooks) {
    res.status(404).send("book with this ID not found");
  }
  res.json(allBooks);
});

// returns most popular books by lang code
app.get("/popular", async (req, res) => {
  const showKidsFriendly = req.query.lang;
  const friendlyBooks = await Book.find({ language_code: showKidsFriendly || "eng", average_rating: { $gt: 4.4 } });

  if (friendlyBooks.length !== 0) {
    res.json(friendlyBooks);
  } else {
    res.status(404).send("no match found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
