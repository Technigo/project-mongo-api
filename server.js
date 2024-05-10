import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import Book from "./models/bookSchema";

// Getting env file
dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongo-bookdata";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Import the Data
import booksData from "./data/books.json";

// Seed the database with the books
// I have set RESET_DB to false since the database is already seeded now
if (process.env.RESET_DB === "true") {
  const seedDatabase = async () => {
    await Book.deleteMany({});

    booksData.forEach((bookData) => {
      new Book(bookData).save();
    });
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 9090;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// API Documentation with express list endpoints
app.get("/", (req, res) => {
  try {
    const endpoints = expressListEndpoints(app);
    res.json(endpoints);
  } catch (error) {
    console.error("The following error occured:", error);
    res
      .status(500)
      .send(
        "Sorry, this page is not available at the moment. Please try again later."
      );
  }
});

// All other endpoints
app.get("/books", async (req, res) => {
  try {
    const allBooks = await Book.find();
    const showTitle = req.query.title;

    if (showTitle) {
      const titleSearch = async (showTitle) => {
        const resultsTitle = await Book.find({
          title: { $regex: new RegExp(showTitle, "i") },
        });
        return resultsTitle;
      };
      const titleResults = await titleSearch(showTitle);
      if (titleResults.length > 0) {
        res.json(titleResults);
      } else {
        res
          .status(404)
          .send("Sorry, we couldn't find any books with that title.");
      }
    } else {
      res.json(allBooks);
    }
  } catch (error) {
    console.error("The following error occured:", error);
    res
      .status(500)
      .send(
        "Sorry, this page is not available at the moment. Please try again later."
      );
  }
});

app.get("/books/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findOne({ bookID: bookId }).exec();

    if (book) {
      res.json(book);
    } else {
      res.status(404).send("Sorry, there is no book with that ID.");
    }
  } catch (error) {
    console.error("The following error occured:", error);
    res
      .status(500)
      .send(
        "Sorry, this page is not available at the moment. Please try again later."
      );
  }
});

app.get("/averageratings/:ratingNum", async (req, res) => {
  try {
    const { ratingNum } = req.params;

    const matchingBooks = await Book.find({
      average_rating: {
        $gte: parseFloat(ratingNum) - 0.5,
        $lt: parseFloat(ratingNum) + 0.5,
      },
    });

    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else if (matchingBooks.length === 0) {
      res
        .status(404)
        .send("Sorry, we couldn't find any books with that average rating.");
    }
  } catch (error) {
    console.error("The following error occured:", error);
    res
      .status(500)
      .send(
        "Sorry, this page is not available at the moment. Please try again later."
      );
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
