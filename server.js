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

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Test för att se om det funkar 
// först skapas en model
const Test = mongoose.model('Test', {
  name: String
})

// Gör så att DB rensas och bara de inom funktionen skapas vid refresh
Test.deleteMany().then(() => {
  new Test({ name: 'J.R.R Tolkien' }).save()
  new Test({ name: 'N.S.Berggren' }).save()
  new Test({ name: 'J.K. Rowling' }).save()
})



// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
// Route 1 visar vår model
app.get("/", (req, res) => {
  // res.send("Hello Technigo!");
  Test.find().then(testing => {
    res.json(testing)
  })
});

// :name, is case sensetive need to be exact
app.get('/:name', (req, res) => {
  Test.findOne({name: req.params.name}).then(test => {
    if(test) {
      res.json(test)
    } else {
      res.status(404).json({ error: 'Not found'})
    }
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
