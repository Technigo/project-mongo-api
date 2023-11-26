import express from "express";
import { BookModel } from "../models/BookModel";
import listEndpoints from "express-list-endpoints";
import booksData from "../data/books.json";

const router = express.Router(); // Creating a router to be used in the application

// Dynamicly generating the endpoints for API documentation/providing information about the available routes in the application

router.get("/", (req, res) => {
  const endpoints = listEndpoints(router);
  res.json(endpoints);
});

// router.get("/get", async (req, res) => {
//   try {
//     const result = await BookModel.find();
//     res.json(result);
//   } catch (error) {
//     //console.error("Error fetching books:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Route to get all the books from the database
router.get("/books", async (req, res) => {
  try {
    const result = await BookModel.find();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" }); // If there's an error with the server, the message will be "Internal Server Error" so that the user knows that the error is not on their end
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

// Route to get all books with a specific language code
router.get("/books/language_code/:language_code", async (req, res) => {
  try {
    const result = await BookModel.find({
      language_code: new RegExp(req.params.language_code, "i"),
    });

    if (!result || result.length === 0) {
      console.log(result);
      return res.status(404).json({ error: "Language code not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Exporting the router to be used elsewhere in the application
module.exports = router;
