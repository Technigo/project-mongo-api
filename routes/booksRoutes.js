
import express from 'express';
import Book from '../models/book';

const router = express.Router();

// Route to get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to get a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findOne({ bookID: req.params.id });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new book
router.post('/', async (req, res) => {
  const newBook = new Book(req.body);
  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error saving new book:', error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
