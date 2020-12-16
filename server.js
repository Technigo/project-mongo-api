import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Author = new mongoose.model("Author", { //here we initialize our custom mongoose model, with a string "Author" and an object (called skimmed).
  name: String,
});

const Book = new mongoose.model("Book", {
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
});

if (process.env.RESET_DATABASE) {
  console.log("Resetting database");

  const seedDatabase = async () => {
    await Author.deleteMany(); // fixes so it does not load more objects with new rendering
    await Book.deleteMany();

    booksData.forEach(item => {
      const newAuthor = new Author(item);
      newAuthor.save();
    });

    booksData.forEach(item => {
      const newBook = new Book(item);
      newBook.save();
    });
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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("API of books");
});

app.get("/authors", async (req, res) => {
  //returns all authors
  const authors = await Author.find();
  res.json(authors);
});

app.get("/authors/:id", async (req, res) => {
  //returns a single author
  const author = await Author.findById(req.params.id);
  res.json(author);
});

app.get("/authors/:id/books", async (req, res) => {
  //returns the books of an author
  const author = await Author.findById(req.params.id);
  const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) });
  res.json(books);
});

app.get("/books", async (req, res) => {
  //returns all the books
  const books = await Book.find().populate("author");
  res.json(books);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
