// server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Book } from "./models/Book.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// Database connection
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/bookdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Routes
app.post("/books", async (req, res) => {
  try {
    const books = req.body;
    const insertedBooks = await Book.insertMany(books);
    res.status(201).json(insertedBooks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE route to delete a book by ID
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH route to remove specific fields from all books
app.patch("/books/remove-fields", async (req, res) => {
  try {
    const fieldsToRemove = req.body.fieldsToRemove;
    const update = {};

    fieldsToRemove.forEach(field => {
      update[field] = "";
    });

    const result = await Book.updateMany({}, { $unset: update });

    res.status(200).json({ message: `Fields removed from ${result.nModified} book(s)` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
