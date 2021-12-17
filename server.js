import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import netflixData from './data/netflix-titles.json';

// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'

// import topMusicData from './data/top-music.json'

const mongoUrl =
	process.env.MONGO_URL || 'mongodb://localhost/project-mongo-netflix';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

//A show database model to start populating the database
//shows all the existing data
const Show = mongoose.model('Show', {
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
});

//Function to start seeding the database,
//and it will only run when variable is present and true
if (process.env.RESET_DB) {
	console.log('Resetting database!');
	const seedDataBase = async () => {
		//Deletes pre-existing shows to prevent duplicates
		await Show.deleteMany({});

		//Creates a new show
		netflixData.forEach((item) => {
			const newShow = new Show(item);
			newShow.save();
		});
	};

	seedDataBase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Our own middlewarethat checks if the database is connected before going to our endpoints
app.use((req, res, next) => {
	if (mongoose.connection.readyState === 1) {
		next();
	} else {
		res.status(503).json({ error: 'Service unavailable' });
	}
});

//RESTful route

// Start defining your routes here
app.get('/', (req, res) => {
	res.send('Hello world, welcome to netflix titles API by Madelene Trang');
});

//showing all the possible enpoints in the app
app.get('/endpoints', (req, res) => {
	res.send(listEndpoints(app));
});

//----COLLECTION 0F RESULT------
//endpoint to get all shows
//Query params
app.get('/shows', async (req, res) => {
	console.log(req.query);

	const { type, country, release_year, director } = req.query;
	let showsToSend = await Show.find(req.query);

	if (req.query.type) {
		const showByType = await Show.find({ type });
		showsToSend = showByType;
	}

	if (req.query.director) {
		const showByDirector = await Show.find({ director });
		showsToSend = showByDirector;
	}

	if (req.query.country) {
		const showByCountry = await Show.find({ country });
		showsToSend = showByCountry;
	}

	if (req.query.release_year) {
		const showByReleaseYear = await Show.find({ release_year });
		showsToSend = showByReleaseYear;
	}

	if (showsToSend) {
		res.json(showsToSend);
	} else {
		res.status(404).json(`Sorry, cannot be found `);
	}
});

//----SINGLE RESULT------
//get a single show based on the title
app.get('/shows/title/:title', async (req, res) => {
	try {
		const singleShowTitle = await Show.findOne({ title: req.params.title });

		if (singleShowTitle) {
			res.status(200).json(singleShowTitle);
		} else {
			res
				.status(404)
				.json({ error: `Sorry, no show can be found with that title ` });
		}

		//invalid title
	} catch (err) {
		res.status(400).json({ error: 'Invalid title, please try again' });
	}
});

//get a single show based on the show's unique id
app.get('/shows/id/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const singleShowID = await Show.findById(id);
		if (singleShowID) {
			res.json(singleShowID);
		} else {
			res.status(404).json({ error: `Sorry, the id can not be found` });
		}

		//invalid id
	} catch (err) {
		res.status(400).json({ error: 'id is invalid, please try again!' });
	}
});

// Start the server
app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server running on http://localhost:${port} YAY`);
});
