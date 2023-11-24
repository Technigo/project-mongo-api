import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import router from "./routes/bookRoutes.js";


// If you're using one of our datasets, uncomment the appropriate import below
// mongodb+srv://User:6HTdQ97WWBy8XQV@cluster0.gcewp2i.mongodb.net/niceBooks?retryWrites=true&w=majority
// connection to database

// mongodb+srv://user:6HTdQ97WWBy8XQV@cluster0.gcewp2i.mongodb.net/Books?retryWrites=true&w=majority&authMechanism=DEFAULT

const mongoUrl = "mongodb://localhost:27017/" 
// process.env.MONGO_URL || ; 
mongoose.set('strictQuery', false);
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(less => console.log("connected")).catch(err => console.log(err));

mongoose.Promise = Promise;

// Defines the port the app will run on. 

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.use(router)

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
