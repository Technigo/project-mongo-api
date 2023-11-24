import express from "express";
import { bookModel } from "../models/schema.js";
import listEndpoints from "express-list-endpoints";

// Create an instance of the Express router
// The router method in this code is like setting up a map or a blueprint for handling different kinds of requests in a web application. It helps organize and define how the application should respond when someone visits different URLs. Think of it as creating a list of instructions for the app to follow when it receives specific requests, like "show me all tasks" or "register a new user." This makes the code neat and helps the app know what to do when someone interacts with it.
const router = express.Router();

router.get("/", (req, res) => {
  res.json(listEndpoints(router));
});

router.get("/books", async (req, res) => {
  try {
    const books = await bookModel.find();
    res.json(books);
  } catch (err) {
    res.status(400).json({ error: "Error fetching books" });
  }
});

router.get("/books/:id", async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid book id" });
  }
});

router.get("/books/author", async (req, res) => {
  const authorName = req.query.author;
  if (!authorName) {
    return res.status(400).json({ error: "Author name is required" });
  }

  try {
    const booksByAuthor = await bookModel.find({ authors: authorName });
    res.json(booksByAuthor);
  } catch (err) {
    res.status(400).json({ error: "Error fetching author's books" });
  }
});
