import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";
import listEndpoints from "express-list-endpoints";
import documentation_API from "./documentation_API.json"

require('dotenv').config();
const fs = require('fs');

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const Book = mongoose.model("Book", {
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
  res.send(documentation);
});


//filter with query parameters

app.get("/books", (req, res) => {
  const { title, authors, average_rating, num_pages, ratings_count, text_reviews_count, language_code } = req.query;  // Destructure the query parameters
  const query = {};  // Create an empty object to store the query
  if (title) {
    query.title = new RegExp(title, "i");
  }
  if (authors) {
    query.authors = new RegExp(authors, "i");
  }
  if (average_rating) {
    query.average_rating = Number(average_rating);
    query.average_rating = {
      $gte: average_rating,
      $lt: average_rating + 1
    };
  }
  if (num_pages) {
    query.num_pages = Number(num_pages);
    query.num_pages = {
      $gte: num_pages,
      $lt: num_pages + 100
    };

  }
  if (ratings_count) {
    query.ratings_count = Number(ratings_count);
    query.ratings_count = {
      $gte: ratings_count,
      $lt: ratings_count + 100
    };
  }
  if (text_reviews_count) {
    query.text_reviews_count = Number(text_reviews_count);
    query.text_reviews_count = {
      $gte: text_reviews_count,
      $lt: text_reviews_count + 100
    };
  }
  if (language_code) {
    query.language_code = language_code;
  }
  Book.find(query).then(books => {  // Use the query object in the find query
    res.json(books);
  }
  );
});





app.get("/books/", (req, res) => {
  const { title } = req.query;
  const queryRegex = new RegExp(title, "i");
  Book.find({ title: queryRegex }).then(books => {
    res.json(books);
  });
});

app.get("/books/id/:id", (req, res) => {
  const id = req.params.id;
  Book.findOne({ bookID: id }).then(book => {
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
});

app.get("/books/authors/:authors", (req, res) => {
  const authors = req.params.authors;
  const queryRegex = new RegExp(authors, "i"); // Create a case-insensitive regex to match authors
  Book.find({ authors: { $regex: queryRegex } }).then(book => { // Use the regex in the find query
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
});

app.get("/books/average_rating/:average_rating", (req, res) => {
  const average_rating = Number(req.params.average_rating);
  Book.find({
    average_rating: {
      $gte: average_rating,
      $lt: average_rating + 1
    }
  }).then(book => {
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
});


app.get("/books/pages_asc/:num_pages", (req, res) => {
  const num_pages = Number(req.params.num_pages);
  Book.find({
    num_pages: {
      $gte: num_pages,
      $lt: num_pages + 100
    }
  }).sort({ num_pages: 1 }).then(book => {
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
});

app.get("/books/pages_desc/:num_pages", (req, res) => {
  const num_pages = Number(req.params.num_pages);
  Book.find({
    num_pages: {
      $gte: num_pages,
      $lt: num_pages + 100
    }
  }).sort({ num_pages: -1 }).then(book => {
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
});


app.get("/books/ratings_count/:ratings_count", (req, res) => {
  const ratings_count = Number(req.params.ratings_count);
  Book.find({
    ratings_count: {
      $gte: ratings_count,
      $lt: ratings_count + 100
    }
  }).then(book => {
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
});

app.get("/books/text_reviews_count/:text_reviews_count", (req, res) => {
  const text_reviews_count = Number(req.params.text_reviews_count);
  Book.find({
    text_reviews_count: {
      $gte: text_reviews_count,
      $lt: text_reviews_count + 100
    }
  }).then(book => {
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
}
);

app.get("/books/language_code/:language_code", (req, res) => {
  const language_code = req.params.language_code;
  Book.find({ language_code: language_code }).then(book => {
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
}
);

//get the list of endpoints
const endpoints = listEndpoints(app);

//convert the list of endpoints to a JSON string
const endpointsJSON = JSON.stringify(endpoints, null, 2);

//updated endpoint content
const updatedEndpoints = JSON.stringify(endpoints, null, 2);

// Read the current content of the file
fs.readFile('documentation_API.json', 'utf8', (err, currentContent) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Compare the current content with the new content
  if (currentContent !== updatedEndpoints) {
    // If the content is different, update the file
    fs.writeFile('documentation_API.json', updatedEndpoints, (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('Successfully wrote new content to documentation_API.json');
      }
    });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
