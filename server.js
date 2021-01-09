import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import booksData from "./data/books.json";

//Author model and connection to database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-books";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

//A model
const Author = mongoose.model("Author", {
  title: String,
  authors: String,
  isbn: Number,
});

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Author.deleteMany();

    booksData.forEach((item) => {
      const newAuthor = new Author(item);
      newAuthor.save();
    });
  };
  seedDatabase();
};

// Routes starts here
app.get("/", (req, res) => {
  res.send("Welcome, this is the database full of great authors and books");
});

//Get all authors
app.get("/authors", async (req, res) => {
  const allAuthors = await Author.find();

  if (allAuthors.length > 0) {
    res.json(allAuthors);
  } else {
    res.status(404).json({ error: "Sorry, could not find the data" });
  }
});

//Get a single title for an author
app.get("/authors/title/:title", async (req, res) => {
  const singleTitle = await Author.findOne({ title: req.params.title });

  if (singleTitle) {
    res.json(singleTitle);
  } else {
    res.status(404).json({ error: "Sorry, could not find the title" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
