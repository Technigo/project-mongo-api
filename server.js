import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello!");
});

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
  text_reviews_count: Number
})

if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany();
    booksData.forEach( singleBook => {
      const newBook = new Book(singleBook);
      newBook.save();
    })
  }
  seedDatabase();
}

//returning array of books
app.get("/books", async (req, res) => {
  const allBooks = await Book.find()
  res.status(200).json({
    data: allBooks,
    success: true,
  })
});

//adding middleware to check if the database is up or not
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

//returning one single object by id
app.get("/books/:id", async (req, res) => {
  try {
    const bookById = await Book.findOne({ bookID: req.params.id})
    if(bookById) {
      res.status(200).json({
        data: bookById,
        success: true,
      })
    } else { 
      res.status(404).json({
        error: 'bookID not found',
        success: false,
      })
    }
  } catch (err) {
    res.status(400).json({
      error: 'Invalid bookID',
      success: false,
    })
  }
})

//finding a title using path params
app.get("/books/title/:title", async (req, res) => {
  const { title } = req.params;
  const bookTitle = await Book.find({title: title});
  
    if (bookTitle.length !== 0) {
      res.status(200).json({
        data: bookTitle,
        success: true,
      })
    } else {
      res.status(404).json({
        error: 'title not found',
        success: false,
      })
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
