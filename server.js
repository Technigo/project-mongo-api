import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Book = mongoose.model('Book', {
  bookID: {
    type: Number,
  },
  title: {
    type: String,
  },
  authors: {
    type: String,
  },
  average_rating: {
    type: Number,
  },
  isbn: {
    type: String,
  },
  isbn13: {
    type: String,
  },
  language_code: {
    type: String,
  },
  num_pages: {
    type: Number,
  },
  ratings_count: {
    type: Number,
  },
  text_reviews_count: {
    type: Number,
  },
});

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!');

  const seedDatabase = async () => {
    // Clears the data before loading new data
    await Book.deleteMany();
    // Save all of the books from books.json to the database
    await booksData.forEach((book) => new Book(book).save());
  };
  seedDatabase();
}
// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//   PORT=9000 npm start
const port = process.env.PORT || 8090
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/books', async (req, res) => {
  const { query } = req.query;
  const queryRegex = new RegExp(query, 'i')
  const books = await Book.find({ title: queryRegex }).sort({
    average_rating: -1,
  })
  res.json(books)
})

app.get('/books/:isbn', async (req, res) => {
  const { isbn } = req.params;
  const book = await Book.findOne({ isbn: isbn });
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: `Could not find book with isbn=${isbn}` });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
