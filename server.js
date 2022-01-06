import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

import booksData from './data/books.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//Setting up Mongoose model for every individual book
const BookInfo = mongoose.model('BookInfo', {
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

//Only keep seedDatabase when setting it up. Remember to comment out/delete when going live!!!
//Otherwise it will keep deleting the old info everytime the server is run
if (process.env.RESET_DB) {
	// const seedDatabase = async () => {
	// 	await BookInfo.deleteMany({});

	BookInfo.forEach((Book) => {
		const newBookInfo = new BookInfo(Book);
		newBookInfo.save();
	});
	// };

	// seedDatabase();
}

// Start defining your routes here
app.get('/', (req, res) => {
	res.send(
		'Welcome to Becky Bs book API! Go to /endpoints to see how to find what you are looking for'
	);
});

app.get('/endpoints', (req, res) => {
	res.send(listEndpoints(app));
});

app.get('/books', (req, res) => {
	res.json(booksData);
});

app.get('/books/:title', (req, res) => {
	BookInfo.findOne({ title: req.params.title }).then((book) => {
		if (book) {
			res.json(book);
		} else {
			res.status(404).json({ error: 'No book with that title found' });
		}
	});
});

app.get('/authors/:authors', (req, res) => {
	BookInfo.find({ authors: req.params.authors }).then((authors) => {
		if (authors) {
			res.json(authors);
		} else {
			res.status(404).json({ error: 'No author with that name found' });
		}
	});
});

app.get('/isbn/:isbn', (req, res) => {
	BookInfo.findOne({ isbn: req.params.isbn }).then((isbn) => {
		if (isbn) {
			res.json(isbn);
		} else {
			res.status(404).json({ error: 'No book with that isbn-number found' });
		}
	});
});

app.get('/language/:language_code', (req, res) => {
	BookInfo.find({ language_code: req.params.language_code }).then(
		(language) => {
			if (language) {
				res.json(language);
			} else {
				res
					.status(404)
					.json({ error: 'No book with that language code found' });
			}
		}
	);
});

// Start the server
app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server running on http://localhost:${port}`);
});
