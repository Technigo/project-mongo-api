import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import booksData from './data/books.json';
import authorsData from './data/authors.json';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//_____________create my modules
const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  //authors: String,
  authors: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
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
    await Book.deleteMany()
    await Author.deleteMany()
    //await booksData.forEach((item) => new Book(item).save())
    //await authorsData.forEach((item) => new Author(item).save())


    let authorsArray = [];

    authorsData.forEach( async item => {
      const newAuthor = new Author(item);
      
      // We push each newRole to array roles
      authorsArray.push(newAuthor);
      await newAuthor.save();
    })
  
    booksData.forEach(async bookItem => {

      // We create new member for element in membersData array from JSON file
      // Important thing to notice: in JSON file we had property "role" with
      // hardcoded string value. We need it to detect which role model should
      // each member have. Later on, hardcoded "role" property will be
      // overwritten by new "role" property, the one with value of ObjectId type.
      // For further reference on that, check out last example from website below,
      // the one about keys collision : https://davidwalsh.name/merge-objects
      const newBook = new Book({
        ...bookItem,
        authors: authorsArray.find(authorItem => authorItem.authors === bookItem.authors)
      });
      await newBook.save();
    })

  };
  seedDatabase();
};

const port = process.env.PORT || 8080;
const app = express();

//_____________Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());
const listEndpoints = require('express-list-endpoints');

//_____________Error message in case server is down
app.use((req, res, next) => {
  if(mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).send({ error: "service unavailable"});
  };
});

//_____________Start defining your routes here
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
    //authors: new RegExp(author, 'i'),
    language_code: new RegExp(language, 'i'),
  }).populate('authors') //to get Author model information in /books
    .sort({ average_rating: - 1 })
    .limit(pageSize)
    .skip(skip);

  if (books) {
    res.json({ 
      currentPage: pageNumber, 
      pageSize: pageSize, 
      numberOfResults: books.length, 
      results: books,
    });
  } else {
    res.status(404).send({ error: "No books found"});
  };
});

//_____________Single book
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
  const singleBook = await Book.findOne({ bookID: +id });
    if (singleBook) {
      res.json(singleBook);
    } else res.status(404).send({ error: `No book with id: ${id} found.` });
  } catch {
    res
    .status(400)
    .send({ error: `${id} is not a valid bookID`});
  };
});

//_____________Array of authors
app.get("/authors", async (req, res) => {
  const { author } = req.query
  const authorsArray = await Author.find({
    authors: new RegExp(author, 'i'),
  });

  if (!authorsArray) {
    res
    .status(404)
    .send({Error: "something went wrong"});
  };
  res.send({ author: authorsArray });
});

app.get('/authors/:id', async (req, res) => {
  const singleAuthor = await Author.findById(req.params.id);
  if (singleAuthor) {
    res.json(singleAuthor);
  } else {
    res.status(404).json({ error: 'Author not found' });
  }
});


app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    const books = await Book.find({
      authors: mongoose.Types.ObjectId(author.id)
    });
    res.json(books);
  } else {
    res.status(404).json({ error: 'authors/:id/books' });
  }
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
//RESET_DATABASE=TRUE npm run dev

//7jpxZB0mhKob9Zri  