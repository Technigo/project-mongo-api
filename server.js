import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";
import listEndpoints from "express-list-endpoints";
import Book from "./models/Book";

//import documentation_API from "./documentation_API.json"
require('dotenv').config();
//const fs = require('fs');

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;
/*
// Destructure the Schema object from the mongoose module
const { Schema } = mongoose;

// Define the schema for the Book model
const BookSchema = new Schema({
  bookID: Number,
  title: {
    type: String,
    required: true
  },
  authors: {
    type: String,
    required: true
  },
  average_rating: Number,
  isbn: {
    type: Number,
    required: true,
    min: 0,
  },
  isbn13: {
    type: Number,
    required: true,
    min: 0,
  },
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
});
//the model is created from the schema
const Book = mongoose.model("Book", BookSchema);
*/
// create index for the title and author field
// text indexe enable full-text search capabilities on the title and authors fields in the Book collection,so we can perform complex search queries on these fields that go beyond simple exact matches. For example, you could use MongoDB's $text query operator to search for books that contain certain words or phrases in their title or authors fields. This can be particularly useful for implementing features like a search bar in your application.

Book.createIndexes({ title: "text", authors: "text" });
/*


// old way to create a model - everything in one place.
const BookModel = mongoose.model("Book", {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
});

*/
// keep this code to reset the database if needed set .env file to false until the database need a reset
//only needed once to reset the database

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({});

    booksData.forEach(bookID => {
      new Book(bookID).save();
    });
  };

  seedDatabase();
}


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 7777;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// get updated documentation
app.get("/", (req, res) => {
  try {
  const endpoints = listEndpoints(app);
  const updatedEndpoints = endpoints.map((endpoint) => {
    if (endpoint.path === "/filterbooks") {
      return {
        path: endpoint.path,
        methods: endpoint.methods,
        queryParameters: [
          { name: "title", description: "Filter by title. Example: /filterbooks?title=Neither Here nor There: Travels in Europe. Can be chained with other parameters. Example: /filterbooks?title=Neither Here nor There: Travels in Europe&language_code=eng" },
          { name: "authors", description: "Filter by authors. Example:/filterbooks?authors=bill Can be chained with other parameters.  Example:/filterbooks?authors=bill&average_rating=3 " },
          { name: "average_rating", description: "Filter by average rating. Example: /filterbooks?average_rating=3 Can be chained with other parameters Example: /filterbooks?average_rating=3&num_pages=200" },
          { name: "num_pages", description: "Filter by number of pages. Example: /filterbooks?num_pages=200 Can be chained with other parameters. Example: /filterbooks?num_pages=200&ratings_count=1000&text_reviews_count=200" },
          { name: "ratings_count", description: "Filter by ratings count. Example: /filterbooks?ratings_count=1000 Can be chained with other parameters  Example: /filterbooks?ratings_count=1000&text_reviews_count=200" },
          { name: "text_reviews_count", description: "Filter by text reviews count. Example: /filterbooks?text_reviews_count=200 Can be chained with other parameters Example: /filterbooks?text_reviews_count=200&language_code=eng&average_rating=4" },
          { name: "language_code", description: "Filter by language code. Example: /filterbooks?language_code=eng Can be chained with other parameters Example: /filterbooks?language_code=eng&average_rating=4" },
        ]
      };
    }
      return {
        path: endpoint.path,
        methods: endpoint.methods,
      };
    });
    res.json(updatedEndpoints);
}
catch (error) {
  res.status(500).json({ error: "Internal server error" });
}
});


//filter with query parameters
app.get("/filterbooks", async (req, res) => {
  try {
    const {
      title,
      authors,
      average_rating,
      num_pages,
      ratings_count,
      text_reviews_count,
      language_code
    } = req.query;

    const query = {};

    if (title) {
      //find the title with the query parameter
      query.title = { $regex: new RegExp(title, 'i') };
    }
    if (authors) {
      query.authors = { $regex: new RegExp(authors, "i") };
    }
    if (average_rating) {
      query.average_rating = {
        $gte: Number(average_rating),
        $lt: Number(average_rating) + 1
      };
    }
    if (num_pages) {
      query.num_pages = {
        $gte: Number(num_pages),
        $lt: Number(num_pages) + 100
      };
    }
    if (ratings_count) {
      query.ratings_count = {
        $gte: Number(ratings_count),
        $lt: Number(ratings_count) + 100
      };
    }
    if (text_reviews_count) {
      query.text_reviews_count = {
        $gte: Number(text_reviews_count),
        $lt: Number(text_reviews_count) + 100
      };
    }
    if (language_code) {
      query.language_code = language_code;
    }

    const books = await Book.find(query).limit(100); // Limit the number of results to 100
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/books/", async (req, res) => {
  try {
    const { title } = req.query;
    const queryRegex = { $regex:  new RegExp(title, "i")};
    const books = await Book.find({ title: queryRegex }).sort({ title: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).exec();
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "ID Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/books/authors/:authors", async (req, res) => {
  try{
  const authors = req.params.authors;
  const queryRegex = new RegExp(authors, "i"); // Create a case-insensitive regex to match authors
  const book = await Book.find({ authors: { $regex: queryRegex } })
    if (book.length > 0) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Author not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/books/average_rating/:average_rating", async (req, res) => {
  try{
  const average_rating = Number(req.params.average_rating);
  const book = await Book.find({
    average_rating: {
      $gte: average_rating,
      $lt: average_rating + 1
    }})
    if (book.length > 0) {
      res.json(book);
    } else {
      res.status(404).json({ error: "No results for this rating" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
  });



app.get("/books/pages_asc/:num_pages", async (req, res) => {
  try{
  const num_pages = Number(req.params.num_pages);
  const book = await Book.find({
    num_pages: {
      $gte: num_pages,
      $lt: num_pages + 50
    }
  }).sort({ num_pages: 1 })
    if (book.length > 0) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book with this amount of pages not found" });
    }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });


app.get("/books/pages_desc/:num_pages", async (req, res) => {
  try{
  const num_pages = Number(req.params.num_pages);
  const book = await Book.find({
    num_pages: {
      $gte: num_pages,
      $lt: num_pages + 50
    }
  }).sort({ num_pages: -1 })
    if (book.length > 0) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book with this amount of pages not found" });
    }} catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });



app.get("/books/ratings_count/:ratings_count", async (req, res) => {
  try {
    const ratings_count = Number(req.params.ratings_count);
  const book = await Book.find({
    ratings_count: {
      $gte: ratings_count,
      $lt: ratings_count + 50
    }})
    if (book.length > 0) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Rating count not found" });
    }} catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });


app.get("/books/text_reviews_count/:text_reviews_count", async (req, res) => {
  try {
  const text_reviews_count = Number(req.params.text_reviews_count);
  const book = await Book.find({
    text_reviews_count: {
      $gte: text_reviews_count,
      $lt: text_reviews_count + 50
    }
  })
    if (book.length > 0) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Text reviews not found" });
    }}
    catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });


app.get("/books/language_code/:language_code", async (req, res) => {
  const language_code = req.params.language_code;
  try{
const book = await Book.find({ language_code: language_code })
    if (book.length > 0) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Language code not found" });
    }} catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

//add new book
  app.post("/books/add/", async (req, res) => {
    try {
      const newBook = await new Book(req.body).save();
      res.status(201).json(newBook);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  //update book
  app.put('/books/update/:id', async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (book) {
        // Update the fields
        const fieldsToUpdate = ["title", "authors", "average_rating", "isbn", "isbn13", "language_code", "num_pages", "ratings_count", "text_reviews_count"];
        fieldsToUpdate.forEach(field => {
          book[field] = req.body[field] || book[field];
        });
        // Save the updated book
        const updatedBook = await book.save();

        res.json(updatedBook);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ error: `Error updating book: ${error}` });
    }
  });

  //delete book
  app.delete('/books/delete/:id', async (req, res) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.id);
      if (book) {
        res.json({ message: 'Book deleted' });
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ error: `Error deleting book: ${error}` });
    }
  });


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
