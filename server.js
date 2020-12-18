import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import booksData from './data/books.json';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  isbn13: String,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

if (process.env.RESET_DATEBASE) {
  const seedDatabase = async () => {
    await Book.deleteMany({})

    booksData.forEach((bookData) => {
      new Book(bookData).save()
    })
  }
  seedDatabase()
}


// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello worlddddd');
});


app.get('/books', async (req, res) => {
  const { author, title, sort } = req.query;
  const authorRegex = new RegExp(author, 'i');
  const titleRegex = new RegExp(title, 'i');

  const sortBy = (sort) => {
    if (sort === 'rating') {
      return { average_rating: -1 }
    }
  }

  const books = await Book.find({
    authors: authorRegex,
    title: titleRegex
  })
    .sort(sortBy(sort))
    res.json(books)
});


app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn
  Book.findOne({ 'isbn': isbn })
    .then((results) => {
      res.json(results)
    }).catch((err) => {
      res.json({ message: 'Book not found!', err: err })
    })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
