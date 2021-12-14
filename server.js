import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import booksData from './data/books.json';
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/books';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// const bookSchema = new mongoose.Schema({
const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

// const Book = mongoose.model('Book', bookSchema);

if (process.env.RESET_DB) {
  console.log();
  const seedDatabase = async () => {
    await Book.deleteMany();

    booksData.forEach((item) => {
      new Book(item).save();
    });
  };
  seedDatabase();
}

// Lists all endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

// Endpoint to get all books, and when you add queries you can get the objects that includes a specific title, author or both.
app.get('/books', async (req, res) => {
  const { title, authors } = req.query;

  const allBooks = await Book.find({
    title: new RegExp(title, 'i'),
    authors: new RegExp(authors, 'i'),
  });

  if (!allBooks) {
    res.status(404).json('Could not find books');
  } else {
    res.json(allBooks);
  }
});

// Endpoint to get a single book by its id
app.get('/books/id/:id', async (req, res) => {
  const { id } = req.params;
  const singleBook = await Book.findOne({ bookID: id });

  if (!singleBook) {
    res.status(404).send(`No book found with id number ${id} :(`);
  } else {
    res.json({
      response: singleBook,
      success: true,
    });
  }
});

// app.get('/books', async (req, res) => {
//   const { author, title, language, isbn } = req.query;

//   const authorRegexp = new RegExp(author, 'i');
//   const titleRegexp = new RegExp(title, 'i');
//   const languageRegexp = new RegExp(language, 'i');
//   const isbnRegexp = new RegExp(isbn, 'i');

//   const searchQuery = {};

//   if (author !== undefined) {
//     searchQuery.authors = authorRegexp;
//   }
//   if (title !== undefined) {
//     searchQuery.title = titleRegexp;
//   }
//   if (language !== undefined) {
//     searchQuery.language_code = languageRegexp;
//   }
//   if (isbn !== undefined) {
//     searchQuery.isbn = isbnRegexp;
//   }

//   const searchQueryResult = await Book.find(searchQuery);

//   if (searchQueryResult.length === 0) {
//     res.status(404).json({
//       error:
//         "Could't not find anything in the database that matches your search query.",
//     });
//   } else {
//     res.json(searchQueryResult);
//   }
// });

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
