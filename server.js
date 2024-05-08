import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { Book } from "./models/Book";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/userExamples";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

/*__________ Start Seeding ___________ */

import bookData from "./data/books.json";

const User = mongoose.model("User", {
  name: String,
});

User.deleteMany().then(() => {
  new User({
    name: "Anna",
  }).save();
  new User({
    name: "Arne",
  }).save();
  new User({
    name: "Ebba",
  }).save();
});

// const Book = mongoose.model("Book", {
//   title: String,
//   authors: String,
//   average_rating: Number,
// });

// Seed the database with all the books from the book json
const seedDatabase = async () => {
  await Book.deleteMany();

  bookData.forEach((book) => {
    new Book(book).save();
  });
};

seedDatabase();

// Defining the port
const port = process.env.PORT || 8000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Check if conntection is stable
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  User.find().then((users) => {
    res.json(users);
  });
});

// Fetch individual user and handle errors
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Invalid user id" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid user id" });
  }
});

// Start defining your routes here
app.get("/books", (req, res) => {
  Book.find().then((books) => {
    res.json(books);
  });
});

// Find one book
app.get("/:title", (req, res) => {
  Book.findOne({ title: req.params.title }).then((book) => {
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
