import express from "express";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import listEndpoints from "express-list-endpoints";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import booksData from "./data/books.json";
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const bookSchema = new mongoose.Schema({
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

const Book = mongoose.model("Book", bookSchema);

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Book.deleteMany();

    booksData.forEach(async (item) => {
      const newBook = new Book({
        ...item,
      });
      await newBook.save();
    });
  };
  seedDB();
}

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
  const { title } = req.query;

  if (title) {
    const books = await Book.find({
      title: {
        $regex: new RegExp(title, "i"),
      },
    });
    res.json(books);
  } else {
    const books = await Book.find();
    res.json(books);
  }
});

app.get("/books/book/:bookID", async (req, res) => {
  const { bookID } = req.params;

  try {
    const singleBook = await Book.findById(bookID);
    res.json(singleBook);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong", details: error });
  }
});

app.get("/books/rating", async (req, res) => {
  let { rating } = req.query;

  rating = Number(rating);
  console.log(rating);

  if (rating) {
    const books = await Book.find({ average_rating: rating });
    res.json(books);
  } else {
    const books = await Book.find();
    res.json(books);
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
