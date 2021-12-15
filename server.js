import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import books from "./data/books.json";
import listEndpoints from "express-list-endpoints";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

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

// Available routes/endpoints below
app.get("/", (req, res) => {
	res.send(listEndpoints(app));
});

app.get("/books", async (req, res) => {
	// const { author, title, language } =
	let filteredBooks = await Book.find(req.query);
	console.log(filteredBooks);
	try {
		if (req.query.author) {
			filteredBooks = await filteredBooks.find("author", req.query.author);
		}
		if (req.query.title) {
			filteredBooks = await filteredBooks.find("title", req.query.title);
		}
		if (req.query.language) {
			filteredBooks = await filteredBooks.find("language", req.query.language);
		}
		res.json(filteredBooks);
	} catch (err) {
		res.status(400).json({
			response: "Search is invalid",
			success: false,
		});
	}
});

//gt is greater than lt is lower than
app.get("/books/rating", async (req, res) => {
	let books = await Book.find(req.query);

	if (req.query.average_rating) {
		const booksOnRating = await books
			.find()
			.gt("average_rating", req.query.average_rating);
		books = booksOnRating;
	}
	res.json(books);
});

app.get("/books/id/:id", async (req, res) => {
	const id = req.params.id;
	const bookById = await books.findById(id);
	try {
		if (bookById) {
			res.json({
				response: bookById,
				success: true,
			});
		} else {
			res.status(404).json({
				response: "Error: book not found",
				success: false,
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
