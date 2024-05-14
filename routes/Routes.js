import express from "express";
import Book from "../models/Book.js";
import listEndpoints from "express-list-endpoints";
import getPaginationParameters from "../utils/pagination.js";
const router = express.Router();

//filter with query parameters
router.get("/filterbooks", async (req, res, next) => {
  try {
    const {
      title,
      authors,
      average_rating,
      num_pages,
      ratings_count,
      text_reviews_count,
      language_code,
    } = req.query;
    const query = {};
    const { skip, limit } = getPaginationParameters(req);
    if (title) {
      //find the title with the query parameter
      query.title = { $regex: new RegExp(title, "i") };
    }
    if (authors) {
      query.authors = { $regex: new RegExp(authors, "i") };
    }
    if (average_rating) {
      query.average_rating = {
        $gte: Number(average_rating),
        $lt: Number(average_rating) + 1,
      };
    }
    if (num_pages) {
      query.num_pages = {
        $gte: Number(num_pages),
        $lt: Number(num_pages) + 100,
      };
    }
    if (ratings_count) {
      query.ratings_count = {
        $gte: Number(ratings_count),
        $lt: Number(ratings_count) + 100,
      };
    }
    if (text_reviews_count) {
      query.text_reviews_count = {
        $gte: Number(text_reviews_count),
        $lt: Number(text_reviews_count) + 100,
      };
    }
    if (language_code) {
      query.language_code = language_code;
    }

    const books = await Book.find(query).skip(skip).limit(limit).exec(); // Limit the number of results to 100
    res.json(books);
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(`Error fetching filtered books : ${error}`);
    // Pass the error to the next middleware
    next(err);
  }
});

router.get("/books/", async (req, res, next) => {
  try {
    const { skip, limit } = getPaginationParameters(req);
    const { title } = req.query;
    const queryRegex = { $regex: new RegExp(title, "i") };
    const books = await Book.find({ title: queryRegex })
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit);
    res.json(books);
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(`Error fetching books: ${error}`);
    // Pass the error to the next middleware
    next(err);
  }
});

router.get("/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).exec();
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: `ID:${id} Not found` });
    }
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(`Error fetching books with this id : ${error}`);
    // Pass the error to the next middleware
    next(err);
  }
});

router.get("/books/authors/:authors", async (req, res, next) => {
  try {
    const { skip, limit } = getPaginationParameters(req);
    const authors = req.params.authors;
    const queryRegex = new RegExp(authors, "i"); // Create a case-insensitive regex to match authors
    const book = await Book.find({ authors: { $regex: queryRegex } })
      .skip(skip)
      .limit(limit);
    if (book.length > 0) {
      res.json(book);
    } else {
      res.status(404).json({ error: `Author: ${authors} not found` });
    }
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(`Error fetching books with authors: ${error}`);
    // Pass the error to the next middleware
    next(err);
  }
});

router.get("/books/average_rating/:average_rating", async (req, res, next) => {
  try {
    const { skip, limit } = getPaginationParameters(req);
    const average_rating = Number(req.params.average_rating);
    const book = await Book.find({
      average_rating: {
        $gte: average_rating,
        $lt: average_rating + 1,
      },
    })
      .skip(skip)
      .limit(limit);
    if (book.length > 0) {
      res.json(book);
    } else {
      res
        .status(404)
        .json({ error: `No results for this rating: ${average_rating}` });
    }
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(`Error fetching books with rating: ${error}`);
    // Pass the error to the next middleware
    next(err);
  }
});

router.get("/books/pages_asc/:num_pages", async (req, res, next) => {
  try {
    const { skip, limit } = getPaginationParameters(req);
    const num_pages = Number(req.params.num_pages);
    const book = await Book.find({
      num_pages: {
        $gte: num_pages,
        $lt: num_pages + 50,
      },
    })
      .sort({ num_pages: 1 })
      .skip(skip)
      .limit(limit);
    if (book.length > 0) {
      res.json(book);
    } else {
      res.status(404).json({ error: `Book with ${num_pages} pages not found` });
    }
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(
      `Error fetching books with set amount of pages: ${error}`
    );
    // Pass the error to the next middleware
    next(err);
  }
});

router.get("/books/pages_desc/:num_pages", async (req, res, next) => {
  try {
    const { skip, limit } = getPaginationParameters(req);
    const num_pages = Number(req.params.num_pages);
    const book = await Book.find({
      num_pages: {
        $gte: num_pages,
        $lt: num_pages + 50,
      },
    })
      .sort({ num_pages: -1 })
      .skip(skip)
      .limit(limit);
    if (book.length > 0) {
      res.json(book);
    } else {
      res.status(404).json({ error: `Book with ${num_pages} pages not found` });
    }
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(
      `Error fetching books with set amount of pages: ${error}`
    );
    // Pass the error to the next middleware
    next(err);
  }
});

router.get("/books/ratings_count/:ratings_count", async (req, res, next) => {
  try {
    const { skip, limit } = getPaginationParameters(req);
    const ratings_count = Number(req.params.ratings_count);
    const book = await Book.find({
      ratings_count: {
        $gte: ratings_count,
        $lt: ratings_count + 50,
      },
    })
      .skip(skip)
      .limit(limit);
    if (book.length > 0) {
      res.json(book);
    } else {
      res
        .status(404)
        .json({ error: `Rating count ${ratings_count} not found` });
    }
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(`Error fetching rating  : ${error}`);
    // Pass the error to the next middleware
    next(err);
  }
});

router.get(
  "/books/text_reviews_count/:text_reviews_count",
  async (req, res, next) => {
    try {
      const { skip, limit } = getPaginationParameters(req);
      const text_reviews_count = Number(req.params.text_reviews_count);
      const book = await Book.find({
        text_reviews_count: {
          $gte: text_reviews_count,
          $lt: text_reviews_count + 50,
        },
      })
        .skip(skip)
        .limit(limit);
      if (book.length > 0) {
        res.json(book);
      } else {
        res.status(404).json({
          error: `Books with ${text_reviews_count} text reviews not found`,
        });
      }
    } catch (error) {
      // If an error occurred, create a new error with a custom message
      const err = new Error(`Error fetching books with text reviews: ${error}`);
      // Pass the error to the next middleware
      next(err);
    }
  }
);

router.get("/books/language_code/:language_code", async (req, res, next) => {
  const language_code = req.params.language_code;
  try {
    const { skip, limit } = getPaginationParameters(req);
    const book = await Book.find({ language_code: language_code })
      .skip(skip)
      .limit(limit);
    if (book.length > 0) {
      res.json(book);
    } else {
      res
        .status(404)
        .json({ error: `${language_code} Language code not found` });
    }
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(`Error fetching book with language code : ${error}`);
    // Pass the error to the next middleware
    next(err);
  }
});

//add new book
router.post("/books/add/", async (req, res, next) => {
  try {
    const newBook = await new Book(req.body).save();
    res.status(201).json(newBook);
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(`Error adding new book: ${error}`);
    // Pass the error to the next middleware
    next(err);
  }
});

//update book
router.put("/books/update/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      // Update the fields
      const fieldsToUpdate = [
        "title",
        "authors",
        "average_rating",
        "isbn",
        "isbn13",
        "language_code",
        "num_pages",
        "ratings_count",
        "text_reviews_count",
      ];
      fieldsToUpdate.forEach((field) => {
        book[field] = req.body[field] || book[field];
      });
      // Save the updated book
      const updatedBook = await book.save();

      res.json(updatedBook);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(`Error updating book: ${error}`);
    // Pass the error to the next middleware
    next(err);
  }
});

//delete book
router.delete("/books/delete/:id", async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (book) {
      res.json({ message: "Book deleted" });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(`Error deleting book: ${error}`);
    // Pass the error to the next middleware
    next(err);
  }
});

// get updated documentation
router.get("/", (req, res, next) => {
  try {
    const endpoints = listEndpoints(router);
    const updatedEndpoints = endpoints.map((endpoint) => {
      if (endpoint.path === "/filterbooks") {
        return {
          path: endpoint.path,
          methods: endpoint.methods,
          queryParameters: [
            {
              name: "title",
              description:
                "Filter by title. Example: /filterbooks?title=Neither Here nor There: Travels in Europe. Can be chained with other parameters. Example: /filterbooks?title=Neither Here nor There: Travels in Europe&language_code=eng",
            },
            {
              name: "authors",
              description:
                "Filter by authors. Example:/filterbooks?authors=bill Can be chained with other parameters.  Example:/filterbooks?authors=bill&average_rating=3 ",
            },
            {
              name: "average_rating",
              description:
                "Filter by average rating. Example: /filterbooks?average_rating=3 Can be chained with other parameters Example: /filterbooks?average_rating=3&num_pages=200",
            },
            {
              name: "num_pages",
              description:
                "Filter by number of pages. Example: /filterbooks?num_pages=200 Can be chained with other parameters. Example: /filterbooks?num_pages=200&ratings_count=1000&text_reviews_count=200",
            },
            {
              name: "ratings_count",
              description:
                "Filter by ratings count. Example: /filterbooks?ratings_count=1000 Can be chained with other parameters  Example: /filterbooks?ratings_count=1000&text_reviews_count=200",
            },
            {
              name: "text_reviews_count",
              description:
                "Filter by text reviews count. Example: /filterbooks?text_reviews_count=200 Can be chained with other parameters Example: /filterbooks?text_reviews_count=200&language_code=eng&average_rating=4",
            },
            {
              name: "language_code",
              description:
                "Filter by language code. Example: /filterbooks?language_code=eng Can be chained with other parameters Example: /filterbooks?language_code=eng&average_rating=4",
            },
            {
              name: "page",
              description:
                "The page number to retrieve. Defaults to 1 if not provided. Example: /?page=2 can be chained with limit. Example: /?page=2&limit=5 Can also be chained with other queries if using /filterbooks/ Example: filterbooks?page=2&limit=5&text_reviews_count=200&language_code=eng&average_rating=4",
            },
            {
              name: "limit",
              description:
                "The number of items per page. Defaults to 10 if not provided. Example: /?limit=5  can be chained with page but also other queries if using /filterbooks/ Example: filterbooks?page=2&limit=5&text_reviews_count=200&language_code=eng&average_rating=4",
            },
          ],
        };
      }
      return {
        path: endpoint.path,
        methods: endpoint.methods,
      };
    });
    res.json(updatedEndpoints);
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const err = new Error(`Error updating endpoints: ${error}`);
    // Pass the error to the next middleware
    next(err);
  }
});

export default router;
