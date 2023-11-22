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
    const title = req.body.title;
    const author = req.body.author;
    const language = req.body.language;
    const rating = req.body.rating;
    const isbn = req.body.isbn;
    const numberOfPages = req.body.numberOfPages;

    await BookModel.create({ 
        title: title,
        author: author,
        language: language,
        rating: rating,
        isbn: isbn,
        numberOfPages: numberOfPages
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