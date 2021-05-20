import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topmusics from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const topMusicSchema = new mongoose.Schema({
  trackName: {
    type: String,
    lowercase: true
  },
  artistName: {
    type: String,
    lowercase: true
  },
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

// endpoint - top music
app.get('/topmusics', async (req, res) => {
  const topmusics = await TopMusic.find();
  res.json(topmusics)
});

// params - find a specific element like id
// query - filtering our colection to catch elements

// Endpoint to find music by id using params
app.get('/topmusics/:musicId', async (req,res) => {
  const { musicId } = req.params;
  const singleMusic = await TopMusic.findById(musicId);
  res.json(singleMusic)
});

// Edpoint to filter music by track name using query
app.get('/topmusics/track/:trackName', async (req,res) => {
  const { trackName } = req.params;
  const singleTrack = await TopMusic.findOne({ trackName });
  res.json(singleTrack)
});


app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
