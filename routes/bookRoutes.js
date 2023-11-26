import express from "express";
import Book from "../models/book.js";

const router = express.Router(); // router is a mini version of app

// all routes in router.js
router.get("/", (req, res) => {
    res.json("Welcome to the book API");
}
);

router.get("/get", async (req, res) => {
    console.log("get all books");

    await Book.find()

    .then((result) => res.json(result))
    .catch((error) => res.json(error));
}
);

// enpoint to display all books sorted by bookID
router.get("/get/sort", async (req, res) => {
    console.log("get all books sorted by bookID");

    await Book.find().sort({ bookID: 1 })
    .then((result) => res.json(result))
    .catch((error) => res.json(error));
}
);



router.get("/get/:id", async (req, res) => {
    const bookID = req.params.id;
    console.log("get book by id");

    await Book.findOne({ bookID: bookID })
    .then((result) => res.json(result))
    .catch((error) => res.json(error));
})


// endpoint for updating the database
router.put("/update/:id", async (req, res) => {
    const bookID = req.params.id;
    const { title, authors, average_rating, isbn, isbn13, language_code, num_pages, ratings_count, text_reviews_count } = req.body;
    const updateBook = { title, authors, average_rating, isbn, isbn13, language_code, num_pages, ratings_count, text_reviews_count };
    await Book.findOneAndUpdate({ bookID: bookID }, updateBook, { new: true })
    .then((result) => res.json(result))
    .catch((error) => res.json(error));
}
);

// endpoint for publishing a new book
router.post("/add", async (req, res) => {
    const newBook = new Book(req.body);
    await newBook
    .save()
    .then((result) => res.json(result))
    .catch((error) => res.json(error));
    console.log(newBook)
}
);


export default router;
