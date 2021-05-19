import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topmusic from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const topMusicSchema = new mongoose.Schema({
  trackName: String,
  artistName: String,
  genre: String,
  popularity: Number,
});

const TopMusic = mongoose.model("TopMusic", topMusicSchema);

const seedDB = () => {
  topmusic.forEach((item) => {
    const newTopMusic = new TopMusic(item);
    newTopMusic.save();
  });
};

seedDB();

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
