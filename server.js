import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import books from "./data/books.json";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Schema
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
	text_reviews_count: Number,
});

if (process.env.RESET_DB) {
	const seedDatabase = async () => {
		await Book.deleteMany();

		books.forEach((item) => {
			const newBook = new Book(item);
			newBook.save();
		});
	};
	seedDatabase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Our own middleware that checks if the database is connected before going forward to our endpoints
app.use((req, res, next) => {
	if (mongoose.connection.readyState === 1) {
		next();
	} else {
		res.status(503).json({ error: "Service unavailable" });
	}
});

// Endpoint with all endpoints
app.get("/", (req, res) => {
	res.send(listEndpoints(app));
});

// Available routes/endpoints below, gt for greater than so that it only shows input rating and up
// RegExp makes it possible to enter part of eg. title or author
app.get("/books/search", async (req, res) => {
	const { author, title, language, rating } = req.query;
	let filteredBooks = await Book.find(req.query);

	try {
		if (author) {
			filteredBooks = await Book.find({
				authors: new RegExp(author, "i"),
			});
		}
		if (title) {
			filteredBooks = await Book.find({
				title: new RegExp(title, "i"),
			});
		}
		if (language) {
			filteredBooks = await Book.find({
				language_code: new RegExp(language, "i"),
			});
		}
		if (rating) {
			filteredBooks = await Book.find().gt("average_rating", rating);
		}
		res.json(filteredBooks);
	} catch (err) {
		res.status(400).json({
			response: "Search is invalid",
			success: false,
		});
	}
});

// // search by isbn or isbn13 number to find a specific book
app.get("/books/isbn", async (req, res) => {
	const { isbn, isbn13 } = req.query;
	let book = await Book.find(req.query);
	try {
		if (isbn) {
			book = await Book.find({ isbn: isbn });
		}
		if (isbn13) {
			book = await Book.find({ isbn13: isbn13 });
		}
		res.json({
			response: book,
			success: true,
		});
	} catch {
		res.status(400).json({
			response: "Isbn or Isbn13 is invalid",
			success: false,
		});
	}
});

// endpoint for all authors, unsorted
app.get("/books/authors", async (req, res) => {
	try {
		const allAuthors = await Book.distinct("authors");
		res.json(allAuthors);
	} catch (err) {
		res.status(400).json({
			response: "No authors found",
			success: false,
		});
	}
});

// endpoint with all books sorted highest to lowest rating (-1 = decreasing)
app.get("/books/rating", async (req, res) => {
	try {
		const ratedBooks = await Book.find().sort({
			average_rating: -1,
		});
		res.status(200).json({
			response: ratedBooks,
			success: true,
		});
	} catch (err) {
		res.status(400).json({
			response: "No rated books found",
			success: false,
		});
	}
});

//endpoint with random book
app.get("/randombook", async (req, res) => {
	const count = await Book.estimatedDocumentCount();
	const random = Math.floor(Math.random() * count);
	const randomBook = await Book.findOne().skip(random);

	if (!randomBook) {
		res.status(404).json({
			response: "Something went wrong, try again!",
			success: false,
		});
	} else {
		res.status(200).json({
			response: randomBook,
			success: true,
		});
	}
});

//finds book info based on id
app.get("/books/id/:id", async (req, res) => {
	const id = req.params.id;
	const bookById = await Book.find({ bookID: id });
	try {
		if (!bookById) {
			res.status(404).json({
				response: "Book not found",
				success: false,
			});
		} else {
			res.json({
				response: bookById,
				success: true,
			});
		}
	} catch (err) {
		res.status(400).json({
			response: "Id is invalid",
			success: false,
		});
	}
});

// Start the server
app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server running on http://localhost:${port}`);
});
