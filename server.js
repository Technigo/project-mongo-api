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

// Available routes/endpoints below
app.get("/", (req, res) => {
	res.send(listEndpoints(app));
});

app.get("/books", async (req, res) => {
	let filteredBooks = await Book.find(req.query);

	try {
		if (req.query.author) {
			filteredBooks = await Book.find({
				authors: new RegExp(req.query.author, "i"),
			});
		}
		if (req.query.title) {
			filteredBooks = await Book.find({
				title: new RegExp(req.query.title, "i"),
			});
		}
		if (req.query.language) {
			filteredBooks = await Book.find({
				language_code: new RegExp(req.query.language, "i"),
			});
		}
		res.json(filteredBooks);
	} catch (err) {
		res.status(400).json({
			response: "Search is invalid",
			success: false,
		});
	}
});

// //endpoint with random book
// app.get("/randomBook", (req, res) => {
// 	let randomBook = booksData[Math.floor(Math.random() * booksData.length)];

// 	if (!randomBook) {
// 		res.status(404).json({
// 			response: "Something went wrong, try again!",
// 			success: false,
// 		});
// 	} else {
// 		res.status(200).json({
// 			response: randomBook,
// 			success: true,
// 		});
// 	}
// });

// // search by isbn or isbn13 number
// app.get("/books/isbn/:isbn", (req, res) => {
// 	const isbn = req.params.isbn;
// 	const book = data.find(
// 		(item) => item.isbn === +isbn || item.isbn13 === +isbn
// 	);
// 	if (!book) {
// 		res.status(404).json({
// 			response: "No book with that ISBN or ISBN13 number",
// 			success: false,
// 		});
// 	} else {
// 		res.status(200).json({
// 			response: book,
// 			success: true,
// 		});
// 	}
// });

//gt is greater than lt is lower than
app.get("/books/rating/:rating", async (req, res) => {
	let ratedBooks = await Book.find(req.query);

	if (req.query.rating) {
		ratedBooks = await Book.find().gt({
			average_rating: req.query.rating,
		});
	}
	res.json(ratedBooks);
});

//works
app.get("/books/id/:id", async (req, res) => {
	const id = req.params.id;
	const bookById = await Book.find({ bookID: id });
	try {
		if (!bookById) {
			res.status(404).json({
				response: "Error: book not found",
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
