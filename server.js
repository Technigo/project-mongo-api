import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

import booksData from './data/books.json';

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
  console.log('Resetting database!'); // remove this later

  const seedDB = async () => {
    await Book.deleteMany();

    await booksData.forEach((item) => {
      const newBook = new Book({
        bookID: item.bookID,
        title: item.title,
        authors: item.authors,
        average_rating: item.average_rating,
        num_pages: item.num_pages
      });
      newBook.save();

      // new Book(item).save();
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
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Books by id
app.get('/books/:id', async (req, res) => {
  try {
    const bookById = await Book.findById(req.params.id);

    if (bookById) {
      res.json(bookById);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

// All authors
// app.get('/books/authors', async (req, res) => {
//   const authors = await Book.find();
//   res.json(authors);
// });

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
