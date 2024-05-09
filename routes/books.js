/* import express from "express";
const router = express.Router();
const Book = require("../models/bookSchema");

router.get("/", async (req, res) => {
  const allBooks = await Book.find();
  const showTitle = req.query.title;

  if (showTitle) {
    const titleSearch = async (showTitle) => {
      const resultsTitle = await Book.find({
        title: { $regex: new RegExp(showTitle, "i") },
      });
      return resultsTitle;
    };
    const titleResults = await titleSearch(showTitle);
    if (titleResults.length > 0) {
      res.json(titleResults);
    } else {
      res
        .status(404)
        .send("Sorry, we couldn't find any books with that title.");
    }
  } else {
    res.json(allBooks);
  }
});

router.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findOne({ bookID: bookId }).exec();

  if (book) {
    res.json(book);
  } else {
    res.status(404).send("Sorry, there is no book with that ID.");
  }
});

export default router; */
