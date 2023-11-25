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

// Dynamicly generating the endpoints for API documentation/providing information about the available routes in the application
router.get("/", (req, res) => {
  const endpoints = listEndpoints(router);
  res.json(endpoints);
});

// router.get("/books", async (req, res) => {
//   await BookModel.find()
//     .then((result) => res.json(result))
//     .catch((error) => res.json(error));
// });

// Route to get all the books from the database
router.get("/books", async (req, res) => {
  try {
    const result = await BookModel.find();
    res.json(result);
  } catch (error) {
    //console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal Server Error" }); // If there's an error with the server, the message will be "Internal Server Error" so that the user knows that the error is not on their end
  }
});

// router.get("/get", async (req, res) => {
//   // This is the route to get all the books from the database
//   await BookModel.find() // This is the method to find all the books in the database
//     .then((result) => res.json(result)) // This is the result of the method
//     .catch((error) => res.json(error)); // Catching the error if there is one
// });

router.get("/get", async (req, res) => {
  try {
    const result = await BookModel.find();
    res.json(result);
  } catch (error) {
    //console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get/:id", async (req, res) => {
  await BookModel.findById(req.params.id)
    .then((result) => res.json(result))
    .catch((error) => res.json(error));
});

// Route to get all the books by a specific author
router.get("/authors/:authors", async (req, res) => {
  const inputAuthor = req.params.authors.toLowerCase();

  const booksByAuthor = booksData.filter(
    (item) => item.authors.toLowerCase().includes(inputAuthor) // Case insensitive search
  );
  if (booksByAuthor.length > 0) {
    // If the author exists in the database, the books by that author will be displayed
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ error: "Author not found" });
  }
});

// router.post("/add", async (req, res) => {
//   // This is the route to add a book to the database
//   const book = req.body.book;
//   await BookModel.create({ book: book }) // This is the method to create a book in the database
//     .then((result) => res.json(result))
//     .catch((error) => res.json(error));
// });

// Route to add a book to the database
router.post("/add", async (req, res) => {
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
      text_reviews_count,
    } = req.body;

    // Validate that required fields are present
    if (
      !bookID ||
      !title ||
      !authors ||
      !average_rating ||
      !isbn ||
      !isbn13 ||
      !language_code ||
      !num_pages ||
      !ratings_count ||
      !text_reviews_count
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await BookModel.create({
      bookID,
      title,
      authors,
      average_rating,
      isbn,
      isbn13,
      language_code,
      num_pages,
      ratings_count,
      text_reviews_count,
    });

    res.status(201).json(result); // 201 Created status for successful creation
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//export default router; // Exporting the router to be used elsewhere in the application
module.exports = router;
