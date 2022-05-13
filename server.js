import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

import topMusicData from './data/top-music.json';
// import beatles from './data/beatles.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Song = mongoose.model('Song', {
	id: Number,
	trackName: String,
	artistName: {
		type: String,
		lowercase: true,
	},
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
	popularity: Number,
});

if (process.env.RESET_DB) {
	const seedDatabase = async () => {
		await Song.deleteMany();
		topMusicData.forEach((songData) => {
			const newSong = new Song(songData);
			newSong.save();
		});
	};
	seedDatabase();
}

// const Album = mongoose.model('Album', {
// 	id: Number,
// 	year: Number,
// 	album: String,
// 	song: String,
// 	danceability: Number,
// 	energy: Number,
// 	mode: Number,
// 	speechiness: Number,
// 	acousticness: Number,
// 	liveness: Number,
// 	valence: Number,
// 	duration_ms: Number,
// 	vocals: String,
// });

// if (process.env.RESET_DB) {
// 	const seedDatabase = async () => {
// 		await Album.deleteMany({});

// 		beatles.forEach((albumData) => {
// 			const newAlbum = new Album(albumData);
// 			newAlbum.save();
// 		});
// 	};

// 	seedDatabase();
// }

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Home page with listed endpoints
app.get('/', (req, res) => {
	res.send(listEndpoints(app));
});

// Get all top songs
app.get('/songs', async (req, res) => {
	const songs = await Song.find();
	res.json(songs);
});

// Get songs by artist name
app.get('/songs/song/:artistName', async (req, res) => {
	const songByArtist = await Song.find({ artistName: req.params.artistName });
	res.send(songByArtist);
});

// Get all beatles albums
// app.get('/albums', async (req, res) => {
// 	const albums = await Album.find();
// 	res.json(albums);
// });

// Get songs by vocals
// app.get('/songs/vocals/:vocals', async (req, res) => {
// 	const songsByVocals = await Album.find({ vocals: req.params.vocals });
// 	res.send(songsByVocals);
// });

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
