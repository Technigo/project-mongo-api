import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// *** Demian example ***
// creating author model
// const Author = mongoose.model("Author", {
//   name: String,
// });

// creating book model
// const Book = mongoose.model("Book", {
//   bookID: Number,
//   title: String,
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Author",
//   },
//   average_rating: Number,
//   isbn: Number,
//   isbn13: Number,
//   language_code: String,
//   num_pages: Number,
//   ratings_count: Number,
//   text_reviews_count: Number,
// });

// seeding data base
// if (process.env.RESET_DATABASE) {
// const seedDatabase = async () => {
//   await Author.deleteMany();
//   await Book.deleteMany();
//   const tolkien = new Author({ name: "J.R.R Tolkien" });
//   await tolkien.save();
//   const rowling = new Author({ name: "J.K. Rowling" });
//   await rowling.save();

//   await new Book({ title: "Harry Potter and the Phylosopher's Stone", author: rowling }).save();
//   await new Book({ title: "The Lord of the Rings", author: tolkien }).save();
// };

// seedDatabase();
// }

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
  res.send("Welcome to Books API!");
});

app.get("/allbooks", async (req, res) => {
  const allBooks = await Book.find();
  res.json(allBooks);
});

// *** if I want to rewrite this code do I have to save a seeded data in var or how I can access it - google tomorrow.
// app.get("/authors/:id/resources", async (req, res) => {
//   const author = await Book.authors.findById(req.params.id);
//   if (author) {
//     const allBooksByAuthor = await Book.find({ author: mongoose.Types.ObjectId(author.id) });
//     res.json(allBooksByAuthor);
//   } else {
//     res.status(404).json({ error: "Author not found" });
//   }
// });

// *** Demian example ***

// app.get("/authors", async (req, res) => {
//   const author = await Author.find();
//   res.json(author);
// });

// app.get("/authors/:id", async (req, res) => {
//   const author = await Author.findById(req.params.id);
//   if (author) {
//     res.json(author);
//   } else {
//     res.status(404).json({ error: "Author not found" });
//   }
// });

// app.get("/authors/:id/allbooks", async (req, res) => {
//   const author = await Author.findById(req.params.id);
//   if (author) {
//     const allBooksByAuthor = await Book.find({ author: mongoose.Types.ObjectId(author.id) });
//     res.json(allBooksByAuthor);
//   } else {
//     res.status(404).json({ error: "Author not found" });
//   }
// });

// app.get("/allbooks", async (req, res) => {
//   const allBooks = await Book.find().populate("author");
//   res.json(allBooks);
// });

// **** my last weeek code ***

//all books data
// with search by queries
// http://localhost:8080/books?author={smth}&title={smth}&lang[]={lang}&lang[]={lang}
app.get("/books", (req, res) => {
  const author = req.query.author?.toLowerCase();
  const title = req.query.title?.toLowerCase();
  const lang = req.query.lang;

  if (lang) {
    if (!Array.isArray(lang) || lang.length === 0) {
      res.status(400).send("lang must be non-empty array");
    }
  }
  let filteredBooks = booksData;

  if (author) {
    filteredBooks = filteredBooks.filter((item) => {
      return item.authors.toLowerCase().includes(author);
    });
  }
  if (title) {
    filteredBooks = filteredBooks.filter((item) => {
      return item.title.toLowerCase().includes(title);
    });
  }
  if (lang) {
    filteredBooks = filteredBooks.filter((item) => {
      return lang.includes(item.language_code);
    });
  }
  if (filteredBooks.length === 0) {
    res.status(404).send("data not found");
  }
  res.json(filteredBooks);
});

// returns most popular books
// http://localhost:8080/popular?kids_friendly=true
app.get("/popular", (req, res) => {
  const showKidsFriendly = req.query.kids_friendly;
  let popularBooks = booksData.filter((item) => {
    return Math.abs(item.average_rating >= 4.4);
  });

  if (showKidsFriendly) {
    popularBooks = popularBooks.filter((item) => item.kids_friendly);
  }

  if (popularBooks.length === 0) {
    res.status(404).send("data not found");
  }
  res.json(popularBooks);
});

//book by ID
app.get("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log({ id });
  const bookById = booksData.filter((item) => {
    const bookWithMatchedId = item.bookID === id;
    return bookWithMatchedId;
  });

  if (!bookById || bookById.length === 0) {
    res.status(404).send("data not found");
  }
  res.json(bookById);
});

//books by rating
app.get("/ratings/:rating", (req, res) => {
  const rating = Math.floor(parseFloat(req.params.rating));
  const selectedBooks = booksData.filter((item) => {
    const filteredBooksMatched = item.average_rating >= rating && item.average_rating < rating + 1;
    return filteredBooksMatched;
  });
  if (selectedBooks.length === 0) {
    res.status(404).send("data not found");
  }
  res.json(selectedBooks);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
