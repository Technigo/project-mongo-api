import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";
import errorData from "./data/errors.json";

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

const { Schema } = mongoose;
  const userSchema = new Schema ({
    name: String,
    age: Number,
    alive: Boolean
}); 

const User= mongoose.model("User", userSchema); 

const errorSchema = new Schema({
  id: Number,
  code: Number,
  message: String,
  length: Number,
  displayMessage: String
})

const Error = mongoose.model("Error", errorSchema);

if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Error.deleteMany();
    errorData.forEach((singleError) => {
      const newError = new Error(singleError);
      newError.save()
    })
  }
  resetDatabase();
  // call a function while declaring it - extra curriculum
}
// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/errors/id/:id", async (req, res) => {
  try {
    const singleError = await Error.findOne(req.params.id);
    if (singleError) {
      res.status(200).json({
        success: true, 
        body: singleError
      })
    } else {
      res.status(404).json({
        success: false, 
        body: {
          message: "Error not found"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false, 
      body: {
        message: "Error not found"
      }
    })
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
