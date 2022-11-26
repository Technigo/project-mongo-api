import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Title = mongoose.model("Title", {
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

if(process.env.RESET_DB) {
  console.log("resetting db")
  const resetDataBase = async () => {
    await Title.deleteMany();

    netflixData.forEach(item => {
      const newTitle = new Title(item);
      newTitle.save();
    })
  }
  resetDataBase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello! Try out the routes '/titles' or '/titles/id/:id' ");
});

//Shows all titiles in the json-file. 
app.get("/titles", async (req, res) => {
  const allTitles = await Title.find()
  res.json(allTitles);
})

//Show a single title with specific id
app.get("/titles/id/:id", async (req, res) => {
  try {
    const singleTitle = await Title.findById(req.params.id);
    if (singleTitle) {
      res.status(200).json({
        success: true,
        body: singleTitle
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the song"
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    });
  }
  
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




