import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!

// Database setup:
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Mongoose model setup:
// Book Model
const Book = mongoose.model("Book", {
  bookID: {
    type: Number,
  },
  title: {
    type: String,
  },
  authors: {
    type: String,
  },
  average_rating: {
    type: Number,
  },
  isbn: {
    type: String,
  },
  isbn13: {
    type: String,
  },
  language_code: {
    type: String,
  },
  num_pages: {
    type: Number,
  },
  ratings_count: {
    type: Number,
  },
  text_reviews_count: {
    type: Number,
  },
});

// -----------------------------------------------
// To reset database and then populate db:
// $ RESET_DATABASE=true npm run dev
// Seed DATABASE using Async
// forEach loop will put all Books from JSON into database
if (process.env.RESET_DATABASE) {
  console.log("Message: Resetting database");

  const seedDatabase = async () => {
    await Book.deleteMany();
    await booksData.forEach((book) => new Book(book).save());
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());
// Middleware for handling if "no connection to Mongodb":
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable " });
  }
});

// -----------------------------------------------
// Start defining routes here:
app.get("/", (req, res) => {
  res.send(
    "My API endpoints: /books ,/books/439554934 ,/sort?sort_by=average_rating ,/info/5eba83e3b3b1c00023249494  plus handling errors"
  );
});

// To return all Books:
// http://localhost:8080/books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  console.log(`Message: Found ${books.length} books`);
  res.json(books);
});

// To return ONE Book via ISBN nr:
// http://localhost:8080/books/312405545
app.get("/books/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const book = await Book.findOne({ isbn: isbn });

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: `Book with ISBN nr ${isbn} not found` });
  }
});

// To sort by rating:
// http://localhost:8080/sort?sort_by=average_rating
app.get("/sort", (req, res) => {
  const { sort_by } = req.query;
  const sort = {};

  if (sort_by && ["average_rating"].includes(sort_by)) {
    sort[sort_by] = -1;
  }
  Book.find({})
    .sort(sort)
    .then((results) => {
      if (results.length === 0) {
        throw new Error("Nothing found");
      }
      res.json(results);
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
});

// To return one book info by id:
// http://localhost:8080/info/5eba83e3b3b1c00023249572
// And to handle server error via try/catch
app.get("/info/:id", async (req, res) => {
  try {
    const bookId = await Book.findById(req.params.id);
    if (bookId) {
      res.json(bookId);
    } else {
      res.status(404).json({ error: "No match for id" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid user id" });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
