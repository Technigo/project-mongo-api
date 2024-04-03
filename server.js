import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import booksData from "./data/books.json";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Books = mongoose.model("Book", {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_review_count: Number,
});

const seedDatabase = async () => {
  try {
    await Books.deleteMany({});
    await Books.insertMany(booksData);
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
seedDatabase();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/books", async (req, res) => {
  try {
    const allBooks = await Books.find();
    res.json(allBooks);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/books/:bookID", async (req, res) => {
  try {
    const { bookID } = req.params;
    const singleBook = await Books.findOne({ bookID });
    if (singleBook) {
      res.json(singleBook);
    } else {
      res.status(404).json({ error: "Book not found, try another number" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
