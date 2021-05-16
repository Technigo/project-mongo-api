import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import booksData from "../data/books.json";
import { Book } from "./models/Book";

dotenv.config();

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(500).json({ message: "Internal server error" });
  } else {
    next();
  }
});

app.get("/seed", (req, res) => {
  try {
    const seedDB = async () => {
      await Book.deleteMany();
      booksData.forEach((book) => new Book(book).save());
    };
    seedDB();
    res.json({ message: "seeding completed!" });
  } catch {
    res.status(500).json({ message: "something went wrong!" });
  }
});

app.get("/", (req, res) => {
  res.send("Books API");
});

app.get("/books", (req, res) => {
  Book.find().then((data) => {
    res.json(data);
  });
});

app.get("/books/min-rate/:rate", async (req, res) => {
  try {
    const { rate } = req.params;
    if (Number.isNaN(Number(rate))) {
      throw new Error("rate should be number");
    }
    if (rate < 0 || rate > 5) {
      throw new Error("rate should be between 0 to 5");
    }
    Book.find({ average_rating: { $gte: rate } })
      .then((books) => {
        res.json({ books });
      })
      .catch(() => {
        throw new Error("something went wrong");
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${port}`);
});
