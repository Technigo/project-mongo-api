import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/bookRoutes.js";



// Connects to the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"; // || "mongodb://localhost/Books"
//process.env.MONGO_URL ||
mongoose.set('strictQuery', false);
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(less => console.log("connected")).catch(err => console.log(err));

// mongoose.Promise = Promise

// Defines the port the development server will run on
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// all routes in router.js
app.use(router) 

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
