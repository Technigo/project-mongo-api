import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
//FIX NEDAN//
//import listEndpoints from 'express-list-endpoints';

import goldenGlobesData from './data/golden-globes.json';

const data = goldenGlobesData;
//NOT SURE WHERE THIS GOES FROM GUIDE DEPLOYING ON NOTION//
//mongodb+srv://Spazza76:<Gotland2022>@cluster0.8w8rr.mongodb.net/goldenGlobes?retryWrites=true&w=majority

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
	const seedDatabase = async () => {
		await Award.deleteMany();
		data.forEach((item) => {
			const newAward = new Award(item);
			newAward.save();
		});
	};
	seedDatabase();
}

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
		'Welcome to the Golden-Globes API. Enter /endpoints to see available endpoints.'
	);
});

//THIS DOES NOT WORK
app.get('/endpoints', (req, res) => {
	//this endpoint is going to tell us all possible endpoint we have
	res.send(listEndpoints(app));
});

//THIS WORKS
app.get('/nominations', (req, res) => {
	//this route will display all nominations
	res.json(data);
});

app.get('/goldenGlobes/nominee', async (res, req) => {
	const nominee = await nominee.find().populate('nominee');
	res.json(nominee);
	if (!data) {
		res.status(404).json('Not found');
	} else {
		res.status(200).json({ data: nominee, success: true });
	}
});

app.get('/goldenGlobes/category', async (res, req) => {
	const category = await category.find().populate('catagory');
	res.json(category);
	if (!data) {
		res.status(404).json('Not found');
	} else {
		res.status(200).json({ data: category, success: true });
	}
});

//FRÅN DAMIEN CODE ALONG similar to above by Daniel?//
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

//TA BORT?
// if (process.env.RESET_DATABASE) {
// 	console.log('Resetting database!');
// 	const seedDatabase = async () => {
// 		await film.deleteMany();
// 		const TheDanishGirl = new film({ name: 'The Danish Girl' });
// 		await TheDanishGirl.save();
// 	};

// 	seedDatabase();
// }

// Start defining your routes here
app.get('/', (req, res) => {
	res.send('Golden Globe winners');
});

//Fetches data from the API FRÅN FÖRRA VECKAN //
app.get('/goldenGlobes', (req, res) => {
	res.status(200).json(data);
});

//THIS DOES NOT WORK
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

	let goldenGlobesWinners = data.find((item) => item.nominee === showName);
	res.status(200).json({ data: goldenGlobesWinners.win, success: true });
});
//här slutar API FRÅN FÖRRA VECKAN //

//FRÅN DAMIEN CODE ALONG endpoints FUNKAR INTE//
app.get('/goldenGlobes/film', async (res, req) => {
	const film = await film.find();
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
