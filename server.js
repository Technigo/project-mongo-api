import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// to get started!
import booksData from "./data/books.json";
// console.log(booksData);

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// PORT=9000 npm start
const port = process.env.PORT || 9000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Book = mongoose.model("Book", {
  bookID: Number,
  title: String,
  authors: String,
  averageRating: Number,
  isbn: Number,
  isbn13: Number,
  languageCode: String,
  numPages: Number,
  ratingsCount: Number,
  textReviewsCount: Number,
});

if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Book.deleteMany({});

    booksData.forEach((book) => {
      const newBook = new Book(book);
      newBook.save();
    });
  };
  resetDataBase();
}

// The middleware help to see if the database is connected before going to endpoint
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(404).json({
      error: "Bad request",
      success: false,
    });
  }
});

// Start defining your routes
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

//Satrting endpoints , Get all the books
app.get("/books", async (req, res) => {
  // res.send(booksData)

  // Filtering By query for booksByNumberOfPage. ".gt()" compering if the number is higher than a specified number.
  let books = await Book.find(req.query);
  if (res.query.numPages) {
    const booksByNumberOfPage = await books
      .find()
      .gt("NumberOfPages", req.query.numPages);
    books = booksByNumberOfPage;
  }

  // flitering By RatingsCount
  if (res.query.ratingsCount) {
    const booksByRatingCount = await books
      .find()
      .gt("RatigsCount", req.query.ratingsCount);
    books = booksByRatingCount;
  }

  // filtering By AvrerageRating
    if (res.query.averageRating) {
      const booksByAvrerageRating= await books
        .find()
        .gt("AvrageRating", req.query.averageRating);
      books = booksByAvrerageRating;
    }

  res.json(books);
});

// Author endpoints
// app.get('/books/authors', async (req, res)=>{
//   try{
//     const booksAuthor = await Book

//   }
//   catch(err){

//   }

// })




// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
