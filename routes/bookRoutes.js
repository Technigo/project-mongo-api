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

// Route to get all the books from the database
router.get("/books", async (req, res) => {
  try {
    const result = await BookModel.find();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" }); // If there's an error with the server, the message will be "Internal Server Error" so that the user knows that the error is not on their end
  }
});

router.get("/get", async (req, res) => {
  try {
    const result = await BookModel.find();
    res.json(result);
  } catch (error) {
    //console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get a specific book by its ID
router.get("/books/byBookID/:bookID", async (req, res) => {
  try {
    const result = await BookModel.findOne({ bookID: req.params.bookID });

    if (!result) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
  const bookID = req.body.bookID;
  const title = req.body.title;
  const authors = req.body.authors;
  const average_rating = req.body.average_rating;
  const isbn = req.body.isbn;
  const isbn13 = req.body.isbn13;
  const language_code = req.body.language_code;
  const num_pages = req.body.num_pages;
  const ratings_count = req.body.ratings_count;
  const text_reviews_count = req.body.text_reviews_count;

  try {
    let result = await BookModel.create({
      bookID: bookID,
      title: title,
      authors: authors,
      language_code: language_code,
      average_rating: average_rating,
      isbn: isbn,
      isbn13: isbn13,
      num_pages: num_pages,
      ratings_count: ratings_count,
      text_reviews_count: text_reviews_count,
    });
    res.status(201).json(result); // 201 Created status for successful creation
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Spara denna
// router.post("/add", async (req, res) => {
//   try {
//     const {
//       bookID,
//       title,
//       authors,
//       average_rating,
//       isbn,
//       isbn13,
//       language_code,
//       num_pages,
//       ratings_count,
//       text_reviews_count,
//     } = req.body;

//     // Validate that required fields are present
//     if (
//       !bookID ||
//       !authors ||
//       !average_rating ||
//       !isbn ||
//       !isbn13 ||
//       !language_code ||
//       !num_pages ||
//       !ratings_count ||
//       !text_reviews_count
//     ) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const result = await BookModel.create({
//       bookID,
//       title,
//       authors,
//       average_rating,
//       isbn,
//       isbn13,
//       language_code,
//       num_pages,
//       ratings_count,
//       text_reviews_count,
//     });

//     res.status(201).json(result); // 201 Created status for successful creation
//   } catch (error) {
//     console.error("Error adding book:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

//export default router; // Exporting the router to be used elsewhere in the application
module.exports = router;
