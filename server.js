import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";
import dotenv from "dotenv"
dotenv.config();
import listEndpoints from "express-list-endpoints";

mongoose.set('strictQuery', false);

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Book = mongoose.model('Book', {
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

// Seed the database
// I previously had this inside an if statement with the RESET_DB,
// but for some reason when I run "RESET_DB=true npm run dev" nothing happens and the database doesn't seed,
// so I took it out and now it works...
  const seedDatabase = async () => {
    await Book.deleteMany({})

    booksData.forEach((book) => {
      new Book(book).save()
    })
  }

  seedDatabase()

// Defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
  });

app.get("/books", async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

app.get("/books/:id", async (req, res) => {
  const bookID = await Book.findOne({ bookID: req.params.id })
  res.json(bookID)
})

app.get("/books/author/:author", async (req, res) => {
  const author = await Book.find({ authors: req.params.author })
  res.json(author)
})

// Start the server
const startServer = async () => {
    await seedDatabase();
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

startServer();
