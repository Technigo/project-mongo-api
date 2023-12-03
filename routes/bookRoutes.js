import express from "express";
import expressListEndpoints from "express-list-endpoints";
import { BookModel } from "../models/book";

const router = express.Router();

// Start defining your routes here

//Endpoint to get documentation of the API
  router.get("/", (req, res) => {
    const endpoints = expressListEndpoints(router);
    res.json(endpoints);
  });
  
  //Endpoint to get all books
  router.get('/books', async (req, res) => {
    try {
      const result = await BookModel.find();
      res.json(result);
    } catch(error) {
      res.json(error);
    }
  });

  //Endpoint to create a new book
  router.post('/books', async (req, res) => {
    try {
      const newBook = await BookModel.create(req.body);
      res.status(201).json(newBook);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

    //Endpoint to get a specific book by ID
    router.get('/books/:id', async (req, res) => {
      try {
        const book = await BookModel.findOne({ bookID: req.params.id });
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        } 
          res.json(book);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

  //Endpoint to delete a book by ID
  router.delete('/books/:id', async (req, res) => {
    try {
      const deletedBook = await BookModel.findByIdAndDelete(req.params.id);
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