
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import listEndpoints from 'express-list-endpoints';
import booksRouter from './routes/booksRoutes'; // Import the books routes
import booksData from './data/books.json'; // Assuming you have a JSON file with books data
import Book from './models/book'; // The Mongoose model for a Book

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:127.0.0.1:27017/mongo-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('MongoDB connected');
  if (process.env.RESET_DB) {
    seedDatabase();
  }
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the booksRouter for handling routes under '/books'
app.use('/books', booksRouter);

app.get('/', (req, res) => {
  res.json({ endpoints: listEndpoints(app) });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

async function seedDatabase() {
  await Book.deleteMany({});
  await Book.insertMany(booksData);
  console.log('Database has been seeded!');
}
