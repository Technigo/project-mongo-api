import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import booksData from './data/books.json';
import authorsData from './data/authors.json';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//_____________create modules
const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
  average_rating: Number,
  isbn: String,
  isbn13: String,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

const Author = mongoose.model('Author', {
  authors: String,
});

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Book.deleteMany();
    await Author.deleteMany();

    let authorsArray = [];

    authorsData.forEach( async item => {
      const newAuthor = new Author(item);
      
      authorsArray.push(newAuthor);
      await newAuthor.save();
    })
  
    booksData.forEach(async bookItem => {
      const newBook = new Book({
        ...bookItem,
        authors: authorsArray.find(authorItem => authorItem.authors === bookItem.authors)
      });
      await newBook.save();
    });
  };
  seedDatabase();
};

const port = process.env.PORT || 8080;
const app = express();

//_____________Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());
const listEndpoints = require('express-list-endpoints');

//_____________Error message in case server is down
app.use((req, res, next) => {
  if(mongoose.connection.readyState === 1) {
    next();
  } else {
    res
    .status(503)
    .send({ error: "service unavailable"});
  };
});

//_____________Routes
app.get('/', (req, res) => {
  if(!res) {
    res
    .status(404)
    .send({ Error: 'Sorry, a problem occured try again later' });
  }
  else res.send(listEndpoints(app));
});

//_____________All books
app.get('/books', async (req, res) => {
  const { title, language, page } = req.query;
  const pageNumber = +page || 1; 
  const pageSize = 20;
  const skip = pageSize * (pageNumber -1);
  const books = await Book.find({
    title: new RegExp(title, 'i'),
    language_code: new RegExp(language, 'i'),
  })
  .populate('authors') 
  .sort({ average_rating: - 1 })
  .limit(pageSize)
  .skip(skip);

  if (books) {
    res.json({ 
      currentPage: pageNumber, 
      pageSize: pageSize, 
      numberOfResults: books.length, 
      results: books,
    });
  } else {
    res
    .status(404)
    .send({ error: "No books found"});
  };
});

//_____________Single book
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
  const singleBook = await Book.findOne({ bookID: +id });
    if (singleBook) {
      res.json({ result: singleBook });
    } else res
      .status(404)
      .send({ error: `No book with id: ${id} found.`});
  } catch {
    res
    .status(400)
    .send({ error: `${id} is not a valid bookID`});
  };
});

//_____________Array of authors
app.get("/authors", async (req, res) => {
  const { author, page } = req.query;
  const pageNumber = +page || 1; 
  const pageSize = 20;
  const skip = pageSize * (pageNumber -1);

  const authorsArray = await Author.find({
    authors: new RegExp(author, 'i'),
  }) 
  .sort({ authors: 1 })
  .limit(pageSize)
  .skip(skip);;

  if (!authorsArray) {
    res
    .status(404)
    .send({Error: "something went wrong" });
  };
  res.send({ 
    currentPage: pageNumber,
    numberOfResults: authorsArray.length, 
    results: authorsArray 
  });
}); 

//_____________Single author based in ID
app.get('/authors/:id', async (req, res) => {
  const singleAuthor = await Author.findById(req.params.id);
  if (singleAuthor) {
    res.json({ result: singleAuthor});
  } else {
    res
    .status(404)
    .json({ error: 'Author not found' });
  }
});

//_____________Books created by author based on authors ID
app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    const books = await Book.find({
      authors: mongoose.Types.ObjectId(author.id)
    })
    .populate('authors')
    .sort({ average_rating: -1 });
    res.json({ 
      numberOfBooks: books.length, 
      results: books 
    });
  } else {
    res
    .status(404)
    .json({ error: 'authors/:id/books' });
  }
});

//_____________Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});