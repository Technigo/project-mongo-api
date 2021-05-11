import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';

import booksData from './data/books.json';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const bookSchema = new mongoose.Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  num_pages: Number
});

const Book = mongoose.model('Book', bookSchema);

if (process.env.RESET_DB) {
  console.log('Resetting database!'); // remove this later?

  const seedDB = async () => {
    await Book.deleteMany();

    await booksData.forEach((item) => {
      new Book(item).save();
    });
  };

  seedDB();
}

const port = process.env.PORT || 8080;
const app = express();

// Middlewares 
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

// ROUTES
// Home
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

// All books
// Books by author, query path: '/books?author=adams'
// Books by title, query path: '/books?title=bill'
app.get('/books', async (req, res) => {
  const { author, title } = req.query;
  const booksToSend = await Book.find();

  // if (author) {
  //   booksToSend = booksToSend = await Book.find({ authors: { $in } });
  // }

  res.json(booksToSend);
});

// Books by top rating (4 or higher)
app.get('/books/toprating', async (req, res) => {
  const booksByTopRating = await Book.find({ average_rating: { $gte: 4 } })

  res.json(booksByTopRating);
});

// Books by short reads (less than 500 pages)
app.get('/books/shortread', async (req, res) => {
  const shortRead = await Book.find({ num_pages: { $lt: 500 } });

  res.json(shortRead);
});

// Books by id
app.get('/books/:id', async (req, res) => {
  try {
    const singleBook = await Book.findById(req.params.id);

    if (singleBook) {
      res.json(singleBook);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid book ID' });
  }
});

// Books by author id
// app.get('/authors/:id/books', async (req, res) => {
//   const author = await Author.findById(req.params.id);

//   if (author) {
//     const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) });
//     res.json(books);
//   } else {
//     res.status(404).json({ error: 'Author not found' });
//   }
// }); 


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
