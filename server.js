import express from "express";
import cors from "cors";
import mongoose from "mongoose";
//import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";
dotenv.config();

import booksData from "./data/books.json";

//const listEndpoints = require("express-list-endpoints");

const mongoUrl = process.env.MONGO_URL; // I switched 'localhost' with xxx (ipv4) because there were issues with connection using ipv6.
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected")) // I had issues with the database connection, so I added this line to see if it was connected or not
  .catch((err) => console.log(err));
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
