import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
import booksData from './data/books.json';
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8090;
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
  text_reviews_count: Number,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany();
    booksData.forEach((singleBook) => {
      const newBook = new Book(singleBook);
      newBook.save();
    });
  };
  seedDatabase();
}

app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/book/:bookName', async (req, res) => {
  const singleBook = await Book.findOne({ title: req.params.bookName });
  res.send(singleBook);
});

app.get('/author/:bookAuthor', async (req, res) => {
  const author = await Book.find({ authors: req.params.bookAuthor });
  res.send(author);
});

app.get('/id/:bookId', async (req, res) => {
  const whatId = await Book.findOne({ bookID: req.params.bookId });

  if (!whatId) {
    res.status(404).json('Sorry! Not found.');
  } else {
    res.status(200).json({
      data: whatId,
      success: true,
    });
  }
});

app.get('/', (req, res) => {
  res.send(booksData);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
