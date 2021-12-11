/* eslint-disable camelcase */
import express from 'express';
import Books from './booksModel';

const authorRouter = express.Router();

// middleware to catch the id param
authorRouter.param('id', async (req, res, next, id) => {
  try {
    const bookId = id;
    if (!bookId || bookId === null) {
      return res.status(404).send('Id does not exist')
    } else {
      const result = await Books.findById(bookId);
      if (result === null || !result) {
        res.status(404).json({ message: 'Book does not exist', success: "false" });
      } else {
        req.bookById = result;
        next();
      }
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "bad id request", success: "true" });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
})

authorRouter.get('/', async (req, res) => {
  try {
    const books = await Books.find();
    if (books) {
      res.status(200).json({ books, success: "true" });
    } else {
      res.status(404).json({ message: 'no authors', success: "false" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

authorRouter.get('/:id', async (req, res) => {
  try {
    res.status(200).json({ book: req.bookById, success: "true" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

// should send all body
authorRouter.put('/:id', async (req, res) => {
  const { body } = req
  try {
    const bookUpdated = await Books.updateOne({ _id: req.bookById }, body);
    if (bookUpdated.nModified > 0) {
      res.status(200).json({ ...body, success: "true" });
    } else {
      res.status(404).json({ message: 'Book nop updated', success: "false" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

// update just one value of the object
authorRouter.patch('/:id', async (req, res) => {
  const { body } = req
  try {
    const bookUpdated = await Books.updateOne({ _id: req.bookById },
      { $set: body });

    if (bookUpdated.nModified > 0) {
      res.status(200).json({ ...body, success: "true" });
    } else {
      res.status(404).json({ message: 'nop updated', success: "false" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

authorRouter.delete('/:id', async (req, res) => {
  try {
    await Books.deleteOne({ _id: req.bookById });
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

authorRouter.post('/', async (req, res) => {
  try {
    const {
      bookID,
      title,
      authors,
      average_rating,
      isbn,
      isbn13,
      language_code,
      num_pages,
      ratings_count,
      text_reviews_count 
    } = req.body;

    if (bookID
      && title
      && authors
      && average_rating
      && isbn
      && isbn13
      && language_code
      && num_pages
      && ratings_count
      && text_reviews_count) {
      const book = new Books(req.body)
      const savedBook = await book.save();
      res.status(200).json({ book: savedBook, success: "true" });
    } else {
      return res.status(400).json({ message: "bad request", success: "true" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

module.exports = authorRouter;