import express from "express";
import { BookModel } from "../models/BookModel";
import listEndpoints from "express-list-endpoints";
import booksData from "../data/books.json";

const router = express.Router(); // Creating a router to be used in the application

// if (process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     await BookModel.deleteMany({});

//     booksData.forEach((bookItem) => {
//       new BookModel(bookItem).save();
//     });
//   };
//   seedDatabase();
// }

router.get("/", (req, res) => {
  const endpoints = listEndpoints(router);
  res.json(endpoints);
  //res.send(listEndpoints(router)); // This is the method to get all the endpoints in the application
});

router.get("/books", async (req, res) => {
  await BookModel.find()
    .then((result) => res.json(result))
    .catch((error) => res.json(error));
});

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

//export default router; // Exporting the router to be used elsewhere in the application
module.exports = router;
