import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany();
    booksData.forEach( singleBook => {
      const newBook = new Book(singleBook);
      newBook.save();
    })
  };
  seedDatabase()
}

app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

//1. endpoint that returns the whole array of book ratings.
app.get("/bookratings", (req, res) => {
  res.status(200).json({
    data: booksData,
    success: true,
  });
});

// 2. endpoint that returns one rated book by its title.
app.get("/bookratings/booktitle/:title", (req, res) => {
  const { title } = req.params;

  const bookByTitle = booksData.find(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );

  if (!bookByTitle) {
    res.status(404).json({
      data: "Not found",
      success: false,
    });
  } else {
    res.status(200).json({
      data: bookByTitle,
      success: true,
    });
  }
});

// 3. endpoint that returns all rated books written by a specific author..
app.get("/bookratings/author/:authors", (req, res) => {
  const { authors } = req.params;

  const bookByAuthor = booksData.filter(
    (book) => book.authors.toLowerCase() === authors.toLowerCase()
  );

  if (!bookByAuthor) {
    res.status(404).json({
      data: "Not found",
      success: false,
    });
  } else {
    res.status(200).json({
      data: bookByAuthor,
      success: true,
    });
  }
});

// 3. endpoint that returns all rated books based on their average rating.
app.get("/bookratings/rating/:average_rating", (req, res) => {
  const { average_rating } = req.params;

  const bookByRating = booksData.filter(
    (book) => book.average_rating === +average_rating
  );
  res.status(200).json({
    data: bookByRating,
    success: true,
  });
});




// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
