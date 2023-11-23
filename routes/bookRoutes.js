import express from "express";
import listEndpoints from "express-list-endpoints";
import { BookModel } from "../models/Book";

const router = express.Router();

// Endpoint "/" to return documentation of API using Express List Endpoints - working
router.get("/", (req, res) => {
    const endpoints = listEndpoints(router);
    res.json({ endpoints });
});

// Define a route to get all the books
router.get("/books", async (req, res) => {
    // Use the BookModel to find all the books in the database
    await BookModel.find()
        .then(result => res.json(result))
        .catch(error => res.json(error));
})

// Define a route to get a book based on ID
router.get("/books/:id", async (req, res) => {
    const { id } = req.params;
    // Use the BookModel to find all the books in the database
    await BookModel.findById({bookID: id})
        .then(result => res.json(result))
        .catch(error => res.json(error));
})

// Define a route to add a new book
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

    await BookModel.create({ 
        bookID: bookID,
        title: title,
        authors: authors,
        language_code: language_code,
        average_rating: average_rating,
        isbn: isbn,
        isbn13: isbn13,
        num_pages: num_pages, 
        ratings_count: ratings_count,
        text_reviews_count: text_reviews_count
    })
        .then(result => res.json(result))
        .catch(error => res.json(error));
})

// Define a route to update for example rating of a book by its ID
router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const average_rating = req.body.average_rating;

    await BookModel.findByIdAndUpdate({bookID: id}, {average_rating: average_rating})
        .then(result => res.json(result))
        .catch(error => res.json(error));
})

// Define a route to delete a book by its ID
router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    await BookModel.findByIdAndDelete({bookID: id})
        .then(result => {
            if (result) {
                res.json({
                    message: `Book with ID ${id} deleted successfully`,
                    deletedBook: result        
                });
            } else {
                res.status(404).json({ error: `Book with ID ${id} cannot be found`})
            }
        })
        .catch(error => res.status(500).json(error));
})

export default router;