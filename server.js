import express, {request, response} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Book = mongoose.model("Book", {
  bookID: Number,
  authors: String,
  average_rating: Number,
  isbn: String,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Book.deleteMany({});
    
    booksData.forEach((bookData) => {
      new Book(bookData).save();
    });
  };
  seedDatabase();
}

const port = process.env.PORT || 4000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

const myEndpoints = require("express-list-endpoints");
app.get("/", (request, response) => {
  response.send(myEndpoints(app));
});

app.use((request, response, next) => {
  if (mongoose.connection.readyState === 1) {
    console.log("Database working")
    next();
  } else {
    response.status(503).json({ error: "Service unavailable" });
  }
});

app.get('/books', async (request, response) => {
  const allBooks = await Book.find();
  response.json(allBooks);
});

app.get("/books/find/:bookID", async (request, response) => {
  try {
    const queriedBook = await Book.findOne({ bookID: request.params.bookID });
    
    if (queriedBook) {
      response.json(queriedBook);
    } else {
      response
        .status(404)
        .json(
          "Hmm, we can't find that book in our database. Try searching another ID!"
        );
    }
  } catch (err) {
    response.status(400).json({ error: "No such book ID" });
  }
});

app.get("/books/isbn/:isbn", async (request, response) => {
  try {
    const { isbn } = request.params;
    const book = await Book.findOne({ isbn: isbn });
    if (book) {
      response.json(book);
    } else {
      response
        .status(404)
        .json({ error: `No books found with the following isbn=${isbn}` });
    }
  } catch (err) {
    response.status(400).json({ error: "invalid request" });
  }
});

app.get("/books/authors/:author", async (request, response) => {
  const searchedAuthor = request.params.author;
  const thisBookAuthor = await Book.find({
    authors: { $regex: new RegExp(searchedAuthor, "i") },
  });
  if (thisBookAuthor.length === 0) {
    response
      .status(404)
      .json(
        "No books have been found by such author. Perhaps try searching another author?"
      );
  }
  response.json(thisBookAuthor);
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
