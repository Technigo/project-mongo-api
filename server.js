import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import booksData from "./data/books.json";
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-book-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

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

// you need the async and await cause JavaScript doesn't wait for fetches and methods that take longer time.

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({});

    booksData.forEach((item) => {
      const newBook = new Book(item);
      newBook.save();
    });
  };

  seedDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
  //list of endpoints
});

// endpoint for all books with query options for number of pages and rating

app.get("/books", async (req, res) => {
  let books = await Book.find(req.query);

  if (req.query.num_pages) {
    const booksByPages = await Book.find()
      .lt("num_pages", req.query.num_pages)
      .sort({ num_pages: 1 });
    books = booksByPages;
  }

  if (req.query.average_rating) {
    const booksByRating = await Book.find()
      .gt("average_rating", req.query.average_rating)
      .sort({ average_rating: -1 });
    books = booksByRating;
  }

  if (req.query.title) {
    const bookByTitle = await Book.find({
      title: new RegExp(title, "i"),
    });
  }

  res.json(books);
});

// .find() - you need this in mongodb till access all the objects in your data
// .sort({ field : 1}) sorting in ascending order /({ field : -1}) in descending order
// gt = greater than
// lt = less than
// .skip - how many to skip in the list .skip(3) will skip the 3 first and give you the rest
// .limit() = limit(10) returns only 10

// endpoint to get a specific book

app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bookById = await Book.findById(id);

    if (bookById) {
      res.json(bookById);
    } else {
      res.status(404).json({ error: "No book found" });
    }
  } catch (err) {
    res.status(400).json({ error: "Id not valid" });
  }

  //where you can get the title, author, rating, language for each book in your frontend
});

// endpoint to get all the authors
app.get("/authors", async (req, res) => {
  // const { authors } = req.params;
  const allAuthors = await Book.distinct("authors");
  res.json(allAuthors);
});

// app.post("/books", {req, res} => {

// })

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
