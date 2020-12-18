import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import booksData from './data/books.json';
import authorsData from './data/authors.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Create my database model's
const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  average_rating: Number,
  isbn: String,
  isbn13: String,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
});

const Author = mongoose.model('Author', {
  authors: String
});

if (process.env.RESET_DATABASE) {
  // POPULATING DATABASE WITH TWO COLLECTIONS (WITH RELATIONS)
  const populateDatabase = async () => {
    // First of all, clear current content of two collections
    await Book.deleteMany();
    await Author.deleteMany();

    // Next, declare empty array in which later on will
    // store all authors from authors.json (of Author models)
    let authorsArray = [];

    authorsData.forEach(async (item) => {
      const newAuthor = new Author(item);

      // Push each newAuthor to array authorsArray
      authorsArray.push(newAuthor);
      await newAuthor.save();
    });

    // Create new book for element in booksData array from JSON file.
    // Important thing to notice: in JSON file we had property "authors" with
    // hardcoded string value. We need it to detect which author model should
    // each book have. Later on, hardcoded "authors" property will be
    // overwritten by new "authors" property, the one with value of ObjectId type.
    // For further reference on that, check out last example from website below,
    // the one about keys collision : https://davidwalsh.name/merge-objects
    booksData.forEach(async (bookItem) => {
      const newBook = new Book({
        ...bookItem,
        authors: authorsArray.find(
          (authorItem) => authorItem.authors === bookItem.authors
        )
      });
      await newBook.save();
    });
  };
  populateDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const myEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Error message in case server is down
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next(); // To execute next get response
  } else {
    res.status(503).send({ error: 'Service unavailable.' });
  }
});

// / endpoint (Root - Homepage)
// RETURNS: A list of available endpoints (in an array)
app.get('/', (req, res) => {
  if (res) {
    res.send(myEndpoints(app));
  } else {
    res
      .status(404)
      .send({ error: 'Sorry, seems like there is an issue, try agian later!' });
  }
});

// /books endpoint
// RETURNS: A list of books from mongoDB with PAGINATION as default with 20 results per page
//
// PARAMETERS:
//  - page
//     usage: /books/?page=4
//  - title
//     usage: /books/?title=harry
//  - language
//     usage: /books/?language=en-US
app.get('/books', async (req, res) => {
  const { title, lang, page } = req.query;
  const pageNumber = +page || 1;
  const pageSize = 20;

  // skip: E.g. page 3: 20 * (3-1) = 40, sends 40 as parameter to .skip()
  // skips index 0-39 so that page 3 starts with the book that has index 40
  const skip = pageSize * (pageNumber - 1);

  // Books with filters based on title and/or lang query
  // Paginated using limit and skip, change page using page query
  const books = await Book.find({
    title: new RegExp(title, 'i'),
    language_code: new RegExp(lang, 'i')
  })
    .populate('authors')
    .sort({ average_rating: -1 }) // Hard coded to sort data descending by average_rating.
    .limit(pageSize)
    .skip(skip);

  // Used to display total books, without pagination
  const booksNoPagination = await Book.find({
    title: new RegExp(title, 'i'),
    language_code: new RegExp(lang, 'i')
  });
  const totalNumberOfBooks = booksNoPagination.length;

  const returnObject = {
    totalNumberOfBooks: totalNumberOfBooks,
    totalNumberOfPages: Math.ceil(totalNumberOfBooks / pageSize), // Round a number upward to its nearest integer
    currentPage: pageNumber,
    pageSize: pageSize,
    skip: skip,
    results: books
  };

  // If the result is zero, status set to 404 and returning a useful data in the response
  if (books.length === 0) {
    res.status(404).send({
      error: 'Sorry, no books where found, please try a different query.'
    });
  } else {
    res.json(returnObject);
  }
});

// /books/top-20-rated endpoint
// RETURNS: A list of 20 top rated books from mongoDB
app.get('/books/top-20-rated', async (req, res) => {
  const top20Rated = await Book.find()
    .populate('authors')
    .sort({ average_rating: -1 }) // Hard coded to sort data descending by average_rating.
    .limit(20); // Hard coded to 20

  if (top20Rated.length === 0) {
    res.status(404).send({
      error: 'Sorry, no books where found.'
    });
  } else
    res.json({
      topTwentyRated:
        'A list of 20 top rated books sorted in descending by average_rating',
      totalNumberOfBooks: top20Rated.length,
      results: top20Rated
    });
});

// /books/:id endpoint
// RETURNS: A single book by id from mongoDB
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const singleBook = await Book.findOne({ bookID: id });

    if (singleBook) {
      res.json(singleBook);
    } else res.status(404).send({ error: `No book with id: ${id} found.` });
  } catch {
    res.status(400).send({ error: `${id} is not a valid bookID.` });
  }
});

// /authors endpoint
// RETURNS: A list of authors from mongoDB
//
// PARAMETERS:
//  - author
//     usage: //authors/?author=douglas
app.get('/authors', async (req, res) => {
  const { author } = req.query;
  const authorsArray = await Author.find({
    authors: new RegExp(author, 'i')
  });

  if (!authorsArray) {
    res.status(404).send({ Error: 'something went wrong' });
  }
  res.send({
    totalNumberOfAuthors: authorsArray.length,
    authors: authorsArray
  });
});

// /authors/:id endpoint
// RETURNS: A single author by id from mongoDB
app.get('/authors/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const singleAuthor = await Author.findById({ _id: id });
    if (singleAuthor) {
      res.json(singleAuthor);
    } else {
      res.status(404).json({ error: 'Author not found' });
    }
  } catch {
    res.status(400).send({ error: `${id} is not a valid author id (_id).` });
  }
});

// /authors/:id/books
// RETURNS: Books by author based on authors ID from mongoDB
app.get('/authors/:id/books', async (req, res) => {
  const { id } = req.params;
  const author = await Author.findById({ _id: id });
  if (author) {
    const books = await Book.find({
      authors: mongoose.Types.ObjectId(author.id)
    }).populate('authors');
    res.json({
      totalNumberOfBooks: books.length,
      books: books
    });
  } else {
    res.status(404).json({ error: `No books found with author id ${id}.` });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
