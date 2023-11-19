import mongoose from 'mongoose';
import Book from './books'; // Adjust the path as needed
import booksData from './data/books.json'; // Adjust the path as needed

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const seedDatabase = async () => {
  await Book.deleteMany({}); // Clears the existing books collection

  booksData.forEach(async (bookData) => {
    const newBook = new Book(bookData);
    await newBook.save();
  });

  console.log('Database has been seeded!');
};

seedDatabase().then(() => {
  mongoose.connection.close();
});
