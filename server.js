import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// In MongoDB, a schema defines the structure of a document, including the field names, data types, and any constraints or validations. 
// It serves as a blueprint for how the data should be organized and is used to ensure consistency in the data
// Schema is basically a (mongoose) skeleton
const { Schema } = mongoose;

const userSchema = new Schema ({
  name: String,
  age: Number,
  alive: Boolean
})

// On the other hand, a model in MongoDB is an object that represents a collection of documents in the database. 
// It acts as an interface between the application and the database, providing methods to perform CRUD operations on the data.

// A model can be created using a schema as a blueprint to ensure that the documents conform to a particular structure and set of rules.

// This is the user model, which makes it possible to create actual data
const User = mongoose.model("User", userSchema)


const titleSchema = new Schema ({
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
})

const Title = mongoose.model("Title", titleSchema)

// Start defining your routes here
app.get("/titles/id/:id", async (req, res) => {
  res.send("Hello sunshine!");
  try {
    const singleTitle = await Title.findOne({ show_id: req.params.id });
    if (singleTitle) {
      res.status(200).json({
        success: true,
        body: singleTitle
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Title is not found"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
