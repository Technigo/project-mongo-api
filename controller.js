import express from 'express';
import Books from './model';

const authorRouter = express.Router();

authorRouter.get('/', async (req, res) => {
  try {
    const books = await Books.find();
    if (books) {
      res.status(200).json({ books, status: "success" });
    } else {
      res.status(404).json({ message: 'no authors', status: "fail" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

module.exports = authorRouter;