import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const mongoURL = process.env.MONGO_URL || "mongodb://localhost/library";
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Mongoos schema
const bookSchema = new mongoose.Schema({
  bookID: mongoose.Number,
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

// Mongoose model
const Book = mongoose.model("Book", bookSchema);

// Seed data
if (process.env.RESET_DB) {
  console.log("Resetting the database!");
  const seedDatabase = async () => {
    await Book.deleteMany({});

    booksData.forEach(async book => {
      const newBook = new Book(book);
      await newBook.save();
    });
  };
  seedDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo, welcome to the library!");
});

// Fetch all Books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.send(books);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
