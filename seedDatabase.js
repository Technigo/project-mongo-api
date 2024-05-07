const mongoose = require('mongoose');
const Book = require('./models/Book');
const booksData = require('./data/booksData');


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const seedDatabase = async () => {
  await Book.deleteMany({});

  booksData.forEach(bookID => {
    new Book(bookID).save();
  });
};

seedDatabase();