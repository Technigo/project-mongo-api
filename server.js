import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import expressListEndpoints from "express-list-endpoints";
import booksData from "./data/books.json";
import { BookSchema } from "./models/BookSchema";

// Configure dotenv
dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Middleware to check database status
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// API documentation route
app.get("/", (req, res) => {
  try {
    const endpoints = expressListEndpoints(app);
    res.json(endpoints);
  } catch (error) {
    console.error("Error", error);
    res
      .status(500)
      .send("This page is unavaliable at the moment. Please try again later.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
