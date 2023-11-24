import express from "express";

import Book from "../models/book.js";

const router = express.Router();

router.get("/get", async (req, res) => {
    console.log("get all books");
    
const Books = await Book.find()
    // .then ((result) => console.log(result))
    // .catch((error) => res.json(error));
    console.log(Books)


})



  
// router.post("/add", async (req, res) => {
//     const newBook = new Book(req.body);
//     await newBook
//     .save()
//     .then((result) => res.json(result))
//     .catch((error) => res.json(error));
// }
// );

// router.put("/update/:id", async (req, res) => {
//     const bookID  = req.params.id;
//     const { title, authors, average_rating, isbn, isbn13, language_code, num_pages, ratings_count, text_reviews_count } = req.body;
//     const updateBook = { title, authors, average_rating, isbn, isbn13, language_code, num_pages, ratings_count, text_reviews_count };
//     await Book.findByIdAndUpdate(bookID, updateBook, { new: true })
//     .then((result) => res.json(result))
//     .catch((error) => res.json(error));
// }
// );

// router.delete("/delete/:id", async (req, res) => {

//     const bookID = req.params.id;

//     await Book.findByIdAndDelete(bookID)
//     .then((result) => {
//         if (result) {
//             res.json("Book deleted");
//         }
//         else {
//             res.json("Book not found");
//         }

//     }
//     )
//     .catch((error) => res.json(error));
// }
// );

// router.delete("deleteAll", async (req, res) => {
//     await Book.deleteMany()
//     .then((result) => res.json({
//         message: `${result.deletedCount} books deleted`,
//     })
//     )
//     .catch((error) => res.json(error));


// }
// );

export default router;
