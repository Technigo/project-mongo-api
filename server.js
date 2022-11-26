import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// PORT=9000 npm start
const port = process.env.PORT || 9000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Book = mongoose.model("Book", {
  bookID: Number,
  title: String,
  authors: String,
  averageRating: Number,
  isbn: Number,
  isbn13: Number,
  languageCode: String,
  numPages: Number,
  ratingsCount: Number,
  textReviewsCount: Number,
});

if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Book.deleteMany({});
    booksData.forEach((singleBook) => {
      const newBook = new Book(singleBook);
      newBook.save();
    });
  };
  resetDataBase();
}

// The middleware help to see if the database is connected before going to endpoint
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(404).json({
      error: "Bad request",
      success: false,
    });
  }
});

// Start defining your routes
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

//Satrting endpoints , Get all the books
app.get("/books", async (req, res) => {
  // res.send(booksData)

  // Filtering By query for booksByNumberOfPage. ".gt()" compering if the number is higher than a specified number.
  const allBooks = await Book.find({});
  res.status(200).json({
    success: true,
    body: allBooks,
  });
});

// Quick search is findbyID
app.get("/books/id/:id", async (req, res) => {
  try {
    const singleBook = await Book.findById(req.params.id);
    if (singleBook) {
      res.json({
        status: 200,
        success: true,
        body: singleBook,
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Book Not Found",
        },
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      body: {
        message: "Invalid ID",
      },
    });
  }
});
// http://localhost:9000/books?title=Harry Potter&languageCode=eng&authors= Rowling-Mary GrandPré

app.get("/books", async (req, res) => {
  const { title, authors, languageCode, averageRating } = req.query;
  const response = {
    success: true,
    body: {},
  };

  const titleQuery = title ? title : /.*/gm;
  const authorsQuery = authors ? authors : /.*/gm;
  const languageCodeQuery = languageCode ? languageCode : /.*/gm;
  const averageRatingQuery = averageRating ? averageRating : {$gt: 0, $lt: 10};

  try {
    response.body = await Book.find({
      title: titleQuery,
      authors: authorsQuery,
      languageCode: languageCodeQuery,
      averageRating: averageRatingQuery,
    })
      .limit(5)
      .sort({ average_rating : 1});
    res.status(200).json({
      success: true,
      body: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: error,
      },
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

