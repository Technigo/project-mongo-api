import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topmusics from "./data/top-music.json";

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

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await TopMusic.deleteMany();

    await topmusics.forEach((item) => {
      const newTopMusic = new TopMusic(item);
      newTopMusic.save();
  });
}
seedDB();
}

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get('/topmusics', async (req, res) => {
  const topmusics = await TopMusic.find();
  res.json(topmusics)
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
