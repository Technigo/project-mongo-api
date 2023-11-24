import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import booksData from "./data/books.json";
import { BookModel } from "./models/BookModel";
import bookRoutes from "./routes/bookRoutes";
//import router from "./routes/bookRoutes";

// Commenting out the seedDatabase function because it is not needed anymore

// const seedDatabase = async () => {
//   try {
//     await BookModel.deleteMany({});
//     await BookModel.insertMany(booksData);
//     console.log("Database reset and seeded successfully");
//   } catch (error) {
//     console.log("Error seeding database:", error);
//   }
// };
// seedDatabase();

const mongoUrl = process.env.MONGO_URL;
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected")) // I had issues with the database connection, so I added a console.log to see if it was connected or not
  .catch((err) => console.log(err));
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridd
const port = process.env.PORT || 8080;
const app = express();

app.use(bookRoutes);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
