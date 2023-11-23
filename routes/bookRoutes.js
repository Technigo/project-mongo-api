import express from "express";
import { BookModel } from "../models/Book";

const router = express.Router(); // Creating a router to be used in the application

router.get("/get", async (req, res) => {
  // This is the route to get all the books from the database
  await BookModel.find() // This is the method to find all the books in the database
    .then((result) => res.json(result)) // This is the result of the method
    .catch((error) => res.json(error)); // Catching the error if there is one
});

router.post("/add", async (req, res) => {
  // This is the route to add a book to the database
  const book = req.body.book;
  await BookModel.create({ book: book }) // This is the method to create a book in the database
    .then((result) => res.json(result))
    .catch((error) => res.json(error));
});

export default router; // Exporting the router to be used elsewhere in the application
