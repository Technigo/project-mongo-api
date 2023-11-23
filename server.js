import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

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
  ratings_count: Number, 
  text_reviews_count: Number,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({});

    books.Data.forEach((bookData) => {
      new Book(bookData).save();
    });
  };

  seedDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/endpoints", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

app.get('/books', async (req, res) => {
  const allBooks = await Book.find();
  res.json(books);
});

app.get('/books/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json(book);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



