import express from "express";
import expressListEndpoints from "express-list-endpoints";
import Book from "../models/book";

const router = express.Router();

// Start defining your routes here

//Endpoint to get documentation of the API
  router.get("/endpoints", (req, res) => {
    const endpoints = expressListEndpoints(router);
    res.json(endpoints);
  });
  
  //Endpoint to get all books
  router.get('/books', async (req, res) => {
    try {
      const allBooks = await Book.find();
      res.json(allBooks);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  //Endpoint to get a specific book by ID
  router.get('/books/:id', async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
      } else {
        res.json(book);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //Endpoint to create a new book
  router.post('/books', async (req, res) => {
    try {
      const newBook = await Book.create(req.body);
      res.status(201).json(newBook);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //Endpoint to delete a book by ID
  router.delete('/books/:id', async (req, res) => {
    try {
      const deletedBook = await Book.findByIdAndDelete(req.params.id);
      if(!deletedBook) {
        res.status(404).json({ error: 'Book Not Found' });
      } else {
        res.json({ message: 'Book deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  export default router;