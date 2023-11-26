import express from "express";
import expressListEndpoints from "express-list-endpoints";
import Book from "./models/book";

const router = express.Router();

// Start defining your routes here
router.get("/", (req, res) => {
    res.send("Hello Technigo!");
  });
  
  router.get("/endpoints", (req, res) => {
    const endpoints = expressListEndpoints(router);
    res.json(endpoints);
  });
  
  router.get('/books', async (req, res) => {
    const allBooks = await Book.find();
    res.json(books);
  });
  
  router.get('/books/:id', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.json(book);
  });

  export default router;