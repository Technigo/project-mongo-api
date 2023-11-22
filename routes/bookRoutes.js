import express from "express";
import listEndpoints from "express-list-endpoints";
import { BookModel } from "../models/Book";

const router = express.Router();

// Endpoint "/" to return documentation of API using Express List Endpoints
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

// Define a route to add a new book
router.post("/add", async (req, res) => {
    const bookID = req.body.bookID;
    const title = req.body.title;
    const authors = req.body.authors;
    const language_code = req.body.language_code;
    const average_rating = req.body.average_rating;
    const isbn = req.body.isbn;
    const num_pages = req.body.num_pages;

    await BookModel.create({ 
        bookID: bookID,
        title: title,
        authors: authors,
        language_code: language_code,
        average_rating: average_rating,
        isbn: isbn,
        num_pages: num_pages
    })
        .then(result => res.json(result))
        .catch(error => res.json(error));
})

// Define a route to update for example rating of a book by its ID
router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const rating = req.body.rating;
    console.log(id);

    await BookModel.findByIdAndUpdate({bookID: id}, {rating: rating})
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