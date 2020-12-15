import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb+srv://thli:VnoP3ss1D4gvm60v@cluster0.igmsc.mongodb.net/project-mongo?retryWrites=true&w=majority";

//"mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//_____________create my modules
const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  isbn13: String,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

const Author = mongoose.model('Author', {
  authors: String,
});

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Book.deleteMany(); //clear database
    await Author.deleteMany(); //clear database
    await booksData.forEach((item) => new Book(item).save()); //single object from json array
    await booksData.forEach((item) => new Author(item).save()); //single object from json array
  };
  seedDatabase();
};

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());
const listEndpoints = require('express-list-endpoints')

//____________error message in case server is down
app.use((req, res, next) => {
  if(mongoose.connection.readyState === 1) {
    next() //to execute next get response
  } else {
    res.status(503).send({ error: "service unavailable"});
  };
});

//____________Start defining your routes here
app.get('/', (req, res) => {
  if(!res) {
      res
      .status(404)
      .send({ Error: 'Sorry, a problem occured try again later' });
  }
  else res.send(listEndpoints(app));
});

//_____________All books
app.get('/books', async (req, res) => {
  const { title, author, language, page } = req.query;
  const pageNumber = +page || 1; //why does ?page=0 console logged out as 1? 
  const pageSize = 20;
  const skip = pageSize * (pageNumber -1);
  //första authors = definering i modell , author = query parameter. - REMOVE
  let books = await Book.find({
    title: new RegExp(title, 'i'),
    authors: new RegExp(author, 'i'),
    language_code: new RegExp(language, 'i')
  })
    .sort({ average_rating: - 1 }) //hard coded to sort data accordingly to this.
    .limit(pageSize)
    .skip(skip)

  if (books) {
    res.json({ 
      currentPage: pageNumber, 
      pageSize: pageSize, 
      numberOfResults: books.length, 
      results: books 
    });
  } else {
    res.status(404).send({ error: "No books found"});
  };
});

//_____________Single book
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
  const singleBook = await Book.findOne({ bookID: id });
    if (singleBook) {
      res.json(singleBook);
    } else res.status(404).send({ error: `No book with id: ${id} found.` });
  } catch {
    res.status(400).send({ error: `${id} is not a valid bookID`});
  };
});

//______________Array of authors
app.get("/authors", async (req, res) => {
  const { author } = req.query;
  const authorsArray = await Author.find({});
  console.log(authorsArray);

  const uniqueAuthorsArray = [...new Set(authorsArray)];
  
  if (!uniqueAuthorsArray) {
    res
    .status(404)
    .send({Error: "something went wrong"});
  };
  //res.send({authors: uniqueAuthorsArray.length, results: uniqueAuthorsArray});
  res.send({ results: uniqueAuthorsArray });
});

//_____________Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//npm install @babel/helper-compilation-targets 
// INCASE PROBLEM STARTING NPM RUN DEV

//testa felmeddelandet starta
//brew services start mongodb-community@4.4 
//brew services stop mongodb-community@4.4 