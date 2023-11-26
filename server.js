import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bookRouter from "./routes/bookRoutes";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/mongo-api";

// Define the seedDatabase function
const seedDatabase = async () => {
  try {
    await Book.deleteMany({});
    booksData.forEach((bookData) => {
      new Book(bookData).save();
    });
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
.then (() => {
  console.log('MongoDB connected');
  if (process.env.RESET_DB) {
    seedDatabase();
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

mongoose.Promise = Promise;

const app = express();


// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Use book routes
app.use("/", bookRouter);

// Catch-all route for unknown endpoints
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



