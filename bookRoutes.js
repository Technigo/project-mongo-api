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
  
  //Endpoint to get a specific book by ID
  router.get('/books/:id', async (req, res) => {
    try {
      const book = await BookModel.findOne({ bookID: req.params.id });
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
      } else {
        res.json(book);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  //Endpoint to get books by a specific author
  router.get('/authors/:author', async (req, res) => {
    try {
      const { author } = req.params;
      const booksByAuthor = await BookModel.find({ authors: author });
      res.json(booksByAuthor);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //Endpoint to get books with less than 200 num_pages
  router.get('/books/less-than-200-pages', async (req, res) => {
    try {
      const booksWithLessThan200Pages = await BookModel.find({ num_pages: { $lt: 200 } });
      res.json(booksWithLessThan200Pages);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/books', async (req, res) => {
    try {
      const newBook = await BookModel.create(req.body);
      res.status(201).json(newBook);
    } catch (error) {
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