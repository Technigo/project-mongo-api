import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
import goldenGlobesData from './data/golden-globes.json';
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

//NOT SURE WHERE THIS GOES FROM GUIDE DEPLOYING ON NOTION//
//mongodb+srv://Spazza76:<Gotland2022>@cluster0.8w8rr.mongodb.net/goldenGlobes?retryWrites=true&w=majority

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//FRÅN DAMIEN CODE ALONG//
const ceremony = mongoose.model('ceremony', {
	name: String,
});

const film = mongoose.model('Film', {
	title: String,
	nominee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Nominee',
	},
});

if (process.env.RESET_DATABASE) {
	console.log('Resetting database!');
	const seedDatabase = async () => {
		await film.deleteMany();
		const TheDanishGirl = new film({ name: 'The Danish Girl' });
		await TheDanishGirl.save();
	};

	seedDatabase();
}
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8070;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
	res.send('Golden Globe winners');
});

//Fetches data from the API FRÅN FÖRRA VECKAN BEHOVER DET VARA MED? DET FUNKAR//
app.get('/goldenGlobes', (req, res) => {
	res.status(200).json(goldenGlobesData);
});

//FRÅN DAMIEN CODE ALONG endpoints FUNKAR INTE//
app.get('/goldenGlobes/film', async (res, req) => {
	const film = await film.find();
	res.json(film);
});

app.get('/goldenGlobes/nominee', async (res, req) => {
	const nominee = await nominee.find().populate('nominee');
	res.json(nominee);
	if (!goldenGlobesData) {
		res.status(404).json('Not found');
	} else {
		res.status(200).json({ data: nominee, success: true });
	}
});

app.get('/goldenGlobes/category', async (res, req) => {
	const category = await category.find().populate('catagory');
	res.json(category);
});

app.get('/goldenGlobes/film/:id/film', async (res, req) => {
	const film = await film.findById(req.params.id);
	const nominee = await nominee.find({
		film: mongoose.Types.ObjectId(film.id),
	});
	res.json(nominee);
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
