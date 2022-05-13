import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";
import beatles from './data/beatles.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Album = mongoose.model('Album', {
	id: Number,
	year: Number,
	album: String,
	song: String,
	danceability: Number,
	energy: Number,
	mode: Number,
	speechiness: Number,
	acousticness: Number,
	liveness: Number,
	valence: Number,
	duration_ms: Number,
	vocals: String,
});

if (process.env.RESET_DB) {
	const seedDatabase = async () => {
		await Album.deleteMany({});

		beatles.forEach((albumData) => {
			new Album(albumData).save();
		});
	};

	seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8081;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Home page with listed endpoints
app.get('/', (req, res) => {
	res.send(listEndpoints(app));
});

// Get all albums
app.get('/albums', async (req, res) => {
	const albums = await Album.find();
	res.json(albums);
});

app.get('/songs/vocals/:vocals', async (req, res) => {
	const songsByVocals = await Album.find({ vocals: req.params.vocals });
	res.send(songsByVocals);
});

// app.get('/titles/:title', (req, res) => {
// 	const { title } = req.params;
// 	const songByTitle = beatles.filter((beatles) =>
// 		beatles.song.toLowerCase().includes(title.toLowerCase())
// 	);

// 	res.status(200).json({
// 		data: songByTitle,
// 		success: true,
// 	});
// });

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
