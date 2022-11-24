import express from "express";
import cors from "cors";
import BooksData from "./data/books.json";
import { Book } from "./lib/mongodb";
import mongoose from "mongoose";

if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Book.deleteMany();
    BooksData.forEach((singlebook) => {
      const newBook = new Book(singlebook);
      newBook.save();
    });
  };
  resetDataBase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
