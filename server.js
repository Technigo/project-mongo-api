import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
//import booksData from './data/books.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Book = mongoose.model('Book', {
  bookID: {
    type: Number
  },
  title: {
    type: String
  },
  authors: {
    type: String
  },
  average_rating: {
    type: Number
  },
  isbn: {
    type: String
  },
  isbn13: {
    type: String
  },
  language_code: {
    type: String
  },
  num_pages: {
    type: Number
  },
  ratings_count: {
    type: Number
  },
  text_reviews_count: {
    type: Number
  }
});

if (process.env.RESET_DATABASE) {
  console.log('Resetting database...');

  const seedDatabase = async () => {
    // Clear our database
    await Book.deleteMany();
    // Save all of the books from books.json to the database
    await booksData.forEach((book) => new Book(book).save());
  };
  seedDatabase();
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

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next(); //to execute next get response
  } else {
    res.status(503).send({ error: 'service unavailable' });
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
// RETURNS: A list of books from mongoDB (project-mongo, mongoose model'Book')
// with PAGINATION as default with 20 results per page
//
// PARAMETERS:
//  - page
//     usage: /books/?page=4
//  - title
//     usage: /books/?title=harry
//  - author
//     usage: /books/?author=douglas adams
//  - language
//     usage: /books/?language=en-US
app.get('/books', async (req, res) => {
  const { title, author, language, page } = req.query;
  const pageNumber = +page || 1; // Why does ?page=0 console logged out as 1?
  console.log(pageNumber);
  /*
  https://www.sitepoint.com/shorthand-javascript-techniques/
  
  if (page !== null || page !== undefined || page !== '') {
     let variable2 = page;
  }
  const variable2 = page || 'new';
  */
  const pageSize = 20;
  // skip: E.g. page 3: 20 * (3-1) = 40, sends 40 as parameter to .skip()
  // skips index 0-39 so that page 3 starts with the book that has index 40
  const skip = pageSize * (pageNumber - 1);

  // Books with filters based on title and/or authors and/or language query
  // Paginated using limit and skip, change page using page query
  let books = await Book.find({
    title: new RegExp(title, 'i'),
    authors: new RegExp(author, 'i'),
    language_code: new RegExp(language, 'i')
  })
    .sort({ average_rating: -1 }) // Hard coded to sort data descending by average_rating.
    .limit(pageSize)
    .skip(skip);

  // Used to display total books, without pagination
  const booksNoPagination = await Book.find();
  const totalNumberOfBooks = booksNoPagination.length;

  const returnObject = {
    totalNumberOfBooks: totalNumberOfBooks,
    totalNumberOfPages: Math.ceil(totalNumberOfBooks / pageSize), // Round a number upward to its nearest integer
    currentPage: pageNumber,
    pageSize: pageSize,
    skip: skip,
    numberOfBooks: books.length,
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

// /books/:id endpoint
// RETURNS: A single book by id from mongoDB (project-mongo, mongoose model'Book')
app.get('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const singleBook = await Book.findOne({ bookID: id });
    if (singleBook) {
      res.json(singleBook);
    } else res.status(404).send({ error: `No book with id: ${id} found.` });
  } catch {
    res.status(400).send({ error: `${id} is not a valid bookID.` });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
