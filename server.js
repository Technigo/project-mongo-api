import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

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
  type: String,
})

if(true) {
  const resetDataBase = async () => {
   netflixData.forEach(singleTitle => {
      const newTitle = new Title(singleTitle)
      newTitle.save();
    })

  }
  resetDataBase();
}

// Routes

app.get("/", (req, res) => {
  res.send("This is an api for Netflix-titles.");
  });

app.get("/titles", async (req, res) => {
  const allTheTitles = await Title.find({});
  res.status(200).json({
    success: true,
    body: allTheTitles
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
