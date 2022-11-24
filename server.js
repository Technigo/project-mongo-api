import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import topMusicData from "./data/top-music.json";

dotenv.config()

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";


const mongoUrl = process.env.MONGO_URL || `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.eilze2r.mongodb.net/project-mongo-api?retryWrites=true&w=majority`
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

// const User = mongoose.model("User", {
// 	name: String,
// 	age: Number,
// 	deceased: Boolean
// });

const Song = mongoose.model("Song", {
  id: Number,
  trackName: String,
  artistName: String,
  genre: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
});


if(process.env.RESET_DB) {
	//resetDataBase
  const seedDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song (singleSong)
			newSong.save()
    })
    // await User.deleteMany();
    // const testUser = new User({name: "Daniel", age: 28, deceased: false});
    // testUser.save();
  }
  seedDatabase();
}

// if(process.env.RESET_DB) {
//   const resetDataBase = async () => {
// 		await User.deleteMany();
		//Here Refrencing our variable User. testUser will be equal to new User
   // new user will accept an argument which will be an object
  //  const testUser = new User({name: "Daniel", age: 28, deceased: false});
   //Invoke the testUser
//    testUser.save();
// 	}
// 	resetDataBase();
// };

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Top-Music API data!");
});

app.get("/songs", async (req, res) => {
	const songs = await Song.find()
	res.json(songs)
})

// app.get("/trackname", async (req, res) => {
//   const name = await trackName.findOne()
//   if (name) {
//     // const books = await Song.find({ name: mongoose.Types.ObjectId(name.id) })
//     res.json(trackname)
//   } else {
//     res.status(404).json({ error: 'TrackName not found' })
//   }
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
