import express from 'express';
import { Book } from '../models/bookModel';

const router = express.Router();

// Helper function for handling errors
const handleErrors = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
};

// Helper function for common parameter destructuring
const destructureParams = (params) => ({
  bookID: params.bookID,
  author: params.author
});

// Route to get all books
router.get('/', async (req, res) => {
  try {
    const allBooks = await Book.find();
    res.json(allBooks);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Route to get a book by ID
router.get('/:bookID', async (req, res) => {
  const { bookID } = destructureParams(req.params);

  try {
    const book = await Book.findOne({ bookID });

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    handleErrors(res, error);
  }
});

// Route to get books by author
router.get('/author/:author', async (req, res) => {
  const { author } = destructureParams(req.params);

  try {
    const books = await Book.find({ authors: author });

    if (books.length > 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: 'No books found by the specified author' });
    }
  } catch (error) {
    handleErrors(res, error);
  }
});

export default router;