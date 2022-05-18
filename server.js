import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import goldenGlobesData from './data/golden-globes.json';

const data = goldenGlobesData;

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8090;
const app = express();

// Starts populating the database
const Award = mongoose.model('Award', {
	year_film: Number,
	year_award: Number,
	ceremony: Number,
	category: String,
	nominee: String,
	film: String,
	win: Boolean,
});

//Starts seeding the database
if (process.env.RESET_DB) {
	// const seedDatabase = async () => {
	// 	await Award.deleteMany({});
	data.forEach((item) => {
		const newAward = new Award(item);
		newAward.save();
	});
}
// seedDatabase();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Middleware that checks if the database is connected before going to endpoints
app.use((req, res, next) => {
	if (mongoose.connection.readyState === 1) {
		next();
	} else {
		res.status(503).json({ error: 'Service unavailable' });
	}
});

//RESTful routes/endpoints
app.get('/', (req, res) => {
	res.send(
		'Welcome to the Golden-Globes API. Endpoints: /goldenglobes /nominations'
	);
});

//this route will display all nominations
app.get('/nominations', (req, res) => {
	res.json(data);
});

// Start defining your routes here
app.get('/', (req, res) => {
	res.send('Golden Globe winners');
});

app.get('/goldenGlobes', (req, res) => {
	res.status(200).json(data);
});

app.get('/goldenGlobes/year_award/:year_award', (req, res) => {
	const filmByYear = data.find(
		(goldenGlobes) => goldenGlobes.year_award === req.params.year_award
	);
	if (!data) {
		res.status(404).json('Not found');
	} else {
		res.status(200).json({ data: filmByYear, success: true });
	}
});

//Shows specific film and if it won or not//
app.get('/goldenGlobes/win/:showName', (req, res) => {
	const showName = req.params.showName;

	let data = data.find((item) => item.nominee === showName);
	res.status(200).json({ data: data.win, success: true });
});

app.get('/film', async (res, req) => {
	const film = await film.find({});
	res.json(film);
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
